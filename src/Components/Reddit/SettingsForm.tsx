import { useState } from 'react';
import {
  Collapse,
  Button,
  TextInput,
  Box,
  Divider,
  Group,
  Badge,
  Title,
} from '@mantine/core';
import { FormList } from '@mantine/form/lib/form-list/form-list';
import { useForm, formList } from '@mantine/form';
import { Settings } from 'types';

interface FormState {
  subReddits: FormList<string>;
  keywords: FormList<string>;
  currentSubReddit: string;
  currentKeyword: string;
}

interface SettingsFormProps {
  settings: Settings;
  onSave: (val: Settings | ((prevState: Settings) => Settings)) => void;
}

export default function SettingsForm({ settings, onSave }: SettingsFormProps) {
  const [opened, setOpen] = useState(false);

  const form = useForm<FormState>({
    initialValues: {
      subReddits: formList(settings.subReddits),
      keywords: formList(settings.keywords),
      currentSubReddit: '',
      currentKeyword: '',
    },

    validate: (values) => ({
      currentSubReddit: values.subReddits.includes(values.currentSubReddit)
        ? 'sub reddit already added'
        : null,

      currentKeyword: values.keywords.includes(values.currentKeyword)
        ? 'keyword already added'
        : null,
    }),
  });

  return (
    <>
      <Button onClick={() => setOpen((o) => !o)}>
        {opened ? 'Hide' : 'Show'} Settings
      </Button>

      <Collapse sx={{ marginTop: '20px' }} in={opened}>
        <Box sx={{ maxWidth: '500px' }}>
          <form>
            <Box>
              <Title sx={{ marginBottom: '8px' }} order={3}>
                Sub Reddits
              </Title>
              <Box>
                {form.values.subReddits.map((sr, i) => (
                  <Badge key={sr} style={{ display: 'inline-block' }}>
                    {sr}{' '}
                    <span
                      onClick={() => form.removeListItem('subReddits', i)}
                      style={{ color: 'red' }}
                    >
                      x
                    </span>
                  </Badge>
                ))}
              </Box>
              <Group
                position="apart"
                sx={{ alignItems: 'end', marginBottom: '20px' }}
              >
                <TextInput
                  sx={{ width: '60%' }}
                  placeholder="r/gameofthrones"
                  label="Add a sub reddit"
                  {...form.getInputProps('currentSubReddit')}
                />
                <Button
                  onClick={() => {
                    if (!form.validateField('currentSubReddit').hasError)
                      form.addListItem(
                        'subReddits',
                        form.values.currentSubReddit
                      );
                    form.setFieldValue('currentSubReddit', '');
                  }}
                >
                  Add sub reddit
                </Button>
              </Group>
            </Box>
            <Divider />

            <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
              <Title sx={{ marginBottom: '8px' }} order={3}>
                Keywords
              </Title>
              <Box>
                {form.values.keywords.map((sr, i) => (
                  <Badge key={sr} style={{ display: 'inline-block' }}>
                    {sr}{' '}
                    <span
                      onClick={() => form.removeListItem('keywords', i)}
                      style={{ color: 'red' }}
                    >
                      x
                    </span>
                  </Badge>
                ))}
              </Box>
              <Group position="apart" sx={{ alignItems: 'end' }}>
                <TextInput
                  sx={{ width: '60%' }}
                  placeholder="Jora"
                  label="Add a keyword"
                  {...form.getInputProps('currentKeyword')}
                />
                <Button
                  onClick={() => {
                    if (!form.validateField('currentKeyword').hasError)
                      form.addListItem('keywords', form.values.currentKeyword);

                    form.setFieldValue('currentKeyword', '');
                  }}
                >
                  Add keyword
                </Button>
              </Group>
            </Box>

            <Button
              color="teal"
              onClick={() =>
                onSave({
                  keywords: Array.from(form.values.keywords),
                  subReddits: Array.from(form.values.subReddits),
                })
              }
            >
              Save Settings
            </Button>
          </form>
        </Box>
      </Collapse>
    </>
  );
}
