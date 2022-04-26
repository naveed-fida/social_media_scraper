/* eslint-disable react/prop-types */
import { useLocalStorage } from '@mantine/hooks';
import { Box, Button } from '@mantine/core';
import { RedditSettings, FetchedComments, LoadingStatus } from 'types';
import { useState } from 'react';
import SettingsForm from './RedditSettingsForm';
import Comments from './Comments';

interface RedditProps {
  show: boolean;
}

export default function Reddit({ show }: RedditProps) {
  const [settings, saveForm] = useLocalStorage<RedditSettings>({
    key: 'scraper-settings',
    defaultValue: { subReddits: [], keywords: [] },
  });

  const [status, setStatus] = useState<LoadingStatus>('not_fetched');

  const [comments, setComments] = useState<FetchedComments>([]);

  const fetchRedditComments = async () => {
    if (settings.subReddits.length === 0 || settings.keywords.length === 0) {
      return;
    }

    setStatus('loading');
    const fetchedComments = await window.electronAPI.getRedditComments(
      settings.subReddits,
      settings.keywords
    );
    setComments(fetchedComments);
    setStatus('fetched');
  };

  return (
    <Box sx={{ display: show ? 'block' : 'none' }}>
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
