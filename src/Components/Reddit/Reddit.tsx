/* eslint-disable react/prop-types */
import { useLocalStorage } from '@mantine/hooks';
import { Box, Button } from '@mantine/core';
import { Settings, FetchedComments, LoadingStatus } from 'types';
import { useState } from 'react';
import SettingsForm from './SettingsForm';
import Comments from './Comments';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/ban-types
    electronAPI: { getRedditComments: Function; saveRedditComments: Function };
  }
}

export default function Reddit() {
  const [settings, saveForm] = useLocalStorage<Settings>({
    key: 'scraper-settings',
    defaultValue: { subReddits: [], keywords: [] },
  });

  const [status, setStatus] = useState<LoadingStatus>('not_fetched');

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
        <Comments status={status} comments={comments} />
      </Box>
    </Box>
  );
}
