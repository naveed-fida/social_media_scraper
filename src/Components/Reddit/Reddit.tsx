import { useLocalStorage } from '@mantine/hooks';
import { Box, Button, Paper, ScrollArea, Stack, Title } from '@mantine/core';
import { Settings, FetchedComments } from 'types';
import { useState } from 'react';
import SettingsForm from './SettingsForm';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/ban-types
    electronAPI: { getRedditComments: Function };
  }
}

export default function Reddit() {
  const [settings, saveForm] = useLocalStorage<Settings>({
    key: 'scraper-settings',
    defaultValue: { subReddits: [], keywords: [] },
  });

  const [status, setStatus] = useState<'not_fetched' | 'fetched' | 'loading'>(
    'not_fetched'
  );

  const [comments, setComments] = useState<FetchedComments>([]);

  const fetchRedditComments = async () => {
    setStatus('loading');
    const fetchedComments = await window.electronAPI.getRedditComments(
      settings.subReddits,
      settings.keywords
    );
    setComments(fetchedComments);
    setStatus('fetched');
  };

  const renderComments = () => {
    if (status === 'loading')
      return <Box sx={{ marginTop: '30px' }}>Loading ....</Box>;
    return (
      <ScrollArea>
        {comments.map((cmnts) => (
          <Box key={cmnts.postTitle} sx={{ marginTop: '30px' }}>
            <Title sx={{ marginBottom: '10px' }}>{cmnts.postTitle}</Title>
            <Stack spacing="sm">
              {cmnts.comments.map((cmnt) => (
                <Paper
                  sx={{ padding: '4px 10px' }}
                  key={cmnt.slice(0, 20)}
                  dangerouslySetInnerHTML={{ __html: cmnt }}
                />
              ))}
            </Stack>
          </Box>
        ))}
      </ScrollArea>
    );
  };

  return (
    <Box>
      <SettingsForm settings={settings} onSave={saveForm} />
      <Box sx={{ marginTop: '30px' }}>
        <Button
          disabled={status === 'loading'}
          onClick={() => fetchRedditComments()}
        >
          {status === 'not_fetched' ? 'Fetch Reddit Comments' : 'Refresh'}
        </Button>
        {renderComments()}
      </Box>
    </Box>
  );
}
