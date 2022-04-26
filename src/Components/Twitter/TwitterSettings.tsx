import { useState } from 'react';
import {
  Collapse,
  Button,
  TextInput,
  Box,
  Group,
  Badge,
  Title,
} from '@mantine/core';
import { FormList } from '@mantine/form/lib/form-list/form-list';
import { useForm, formList } from '@mantine/form';
import { TwitterSettings } from 'types';

interface FormState {
  keywords: FormList<string>;
  currentKeyword: string;
  tweetsPerKeyword: number;
}

interface SettingsFormProps {
  settings: TwitterSettings;
  onSave: (
    val: TwitterSettings | ((prevState: TwitterSettings) => TwitterSettings)
  ) => void;
}

export default function SettingsForm({ settings, onSave }: SettingsFormProps) {
  const [opened, setOpen] = useState(false);

  const form = useForm<FormState>({
    initialValues: {
      keywords: formList(settings.keywords),
      currentKeyword: '',
      tweetsPerKeyword: settings.tweetsPerKeyword,
    },

    validate: (values) => ({
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
                  placeholder="Slack"
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

            <Box>
              <Group position="apart">
                <TextInput
                  sx={{ width: '100%' }}
                  label="Tweets Per Keyword (multiples of 10)"
                  placeholder="Tweets to fetch per keyword"
                  {...form.getInputProps('tweetsPerKeyword')}
                />
              </Group>
            </Box>

            <Button
              sx={{ marginTop: '20px' }}
              color="teal"
              onClick={() =>
                onSave({
                  keywords: Array.from(form.values.keywords),
                  tweetsPerKeyword: form.values.tweetsPerKeyword,
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
