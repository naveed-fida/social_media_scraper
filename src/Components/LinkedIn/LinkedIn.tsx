/* eslint-disable react/prop-types */
import { useLocalStorage } from '@mantine/hooks';
import { Box, Button } from '@mantine/core';
import { LinkedInSettings, LoadingStatus, LinkedInPost } from 'types';
import { useState } from 'react';
import SettingsForm from './LinkedInSettingsForm';
import Posts from './Posts';

interface LinkedInProps {
  show: boolean;
}

export default function LinkedIn({ show }: LinkedInProps) {
  const [settings, saveForm] = useLocalStorage<LinkedInSettings>({
    key: 'scraper-linkedin-settings',
    defaultValue: { keywords: [], postsPerKeyword: 50, sessionId: null },
  });

  const [status, setStatus] = useState<LoadingStatus>('not_fetched');

  const [posts, setPosts] = useState<
    Array<{ keyword: string; posts: Array<LinkedInPost> }>
  >([]);

  const fetchPosts = async () => {
    if (settings.keywords.length === 0 || settings.sessionId === null) {
      return;
    }

    setStatus('loading');
    const fetchedPosts = await window.electronAPI.getLinkedInPosts(
      settings.keywords,
      settings.postsPerKeyword,
      settings.sessionId
    );
    setPosts(fetchedPosts);
    setStatus('fetched');
  };

  return (
    <Box sx={{ display: show ? 'block' : 'none' }}>
      <SettingsForm settings={settings} onSave={saveForm} />
      <Box sx={{ marginTop: '30px' }}>
        <Button disabled={status === 'loading'} onClick={() => fetchPosts()}>
          {status === 'fetched' ? 'Refresh' : 'Fetch Posts'}
        </Button>
        <Posts status={status} posts={posts} />
      </Box>
    </Box>
  );
}
