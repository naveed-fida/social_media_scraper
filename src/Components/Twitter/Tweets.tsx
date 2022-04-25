import { ScrollArea, Paper, Loader, Button } from '@mantine/core';
import { LoadingStatus, Tweet } from 'types';

interface TweetsProps {
  status: LoadingStatus;
  tweets: Array<Tweet>;
}

const Tweets = ({ status, tweets }: TweetsProps) => {
  if (status === 'loading') {
    return <Loader sx={{ marginTop: '30px' }} />;
  }

  if (status === 'fetched') {
    return (
      <ScrollArea>
        <Button
          sx={{ marginTop: '20px' }}
          onClick={() => window.electronAPI.saveTweets(tweets)}
        >
          Save to File
        </Button>
        {tweets.map((tweet) => (
          <Paper p="md" key={tweet.id} sx={{ marginTop: '30px' }}>
            {tweet.text}
          </Paper>
        ))}
      </ScrollArea>
    );
  }

  return null;
};

export default Tweets;
