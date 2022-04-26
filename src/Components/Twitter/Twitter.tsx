/* eslint-disable react/prop-types */
import { useLocalStorage } from '@mantine/hooks';
import { Box, Button } from '@mantine/core';
import { TwitterSettings, LoadingStatus, Tweet } from 'types';
import { useState } from 'react';
import SettingsForm from './TwitterSettings';
import Tweets from './Tweets';

interface TwitterProps {
  show: boolean;
}

export default function Reddit({ show }: TwitterProps) {
  const [settings, saveForm] = useLocalStorage<TwitterSettings>({
    key: 'scraper-twitter-settings',
    defaultValue: { keywords: [], tweetsPerKeyword: 50 },
  });

  const [status, setStatus] = useState<LoadingStatus>('not_fetched');

  const [tweets, setTweets] = useState<Array<Tweet>>([]);

  const fetchTweets = async () => {
    if (settings.keywords.length === 0 || settings.tweetsPerKeyword < 10) {
      return;
    }

    setStatus('loading');
    const fetchedTweets = await window.electronAPI.getTweets(
      settings.keywords,
      settings.tweetsPerKeyword
    );

    setTweets(fetchedTweets);
    setStatus('fetched');
  };

  return (
    <Box sx={{ display: show ? 'block' : 'none' }}>
      <SettingsForm settings={settings} onSave={saveForm} />
      <Box sx={{ marginTop: '30px' }}>
        <Button disabled={status === 'loading'} onClick={() => fetchTweets()}>
          {status === 'fetched' ? 'Refresh' : 'Fetch Tweets'}
        </Button>
        <Tweets status={status} tweets={tweets} />
      </Box>
    </Box>
  );
}
