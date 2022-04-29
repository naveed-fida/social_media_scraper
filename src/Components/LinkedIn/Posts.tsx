import { ScrollArea, Paper, Loader, Button, Title, Box } from '@mantine/core';
import { LoadingStatus, LinkedInPost } from 'types';

interface PostsProps {
  status: LoadingStatus;
  posts: Array<{ keyword: string; posts: Array<LinkedInPost> }>;
}

const Posts = ({ status, posts }: PostsProps) => {
  if (status === 'loading') {
    return <Loader sx={{ marginTop: '30px' }} />;
  }

  if (status === 'fetched') {
    return (
      <ScrollArea>
        <Button
          sx={{ marginTop: '20px' }}
          onClick={() => window.electronAPI.saveLinkedInPosts(posts)}
        >
          Save to File
        </Button>
        {posts.map((post) => (
          <Box sx={{ marginTop: '20px' }} key={post.keyword}>
            <Title order={2}>Posts for Keyword: {post.keyword}</Title>
            {post.posts.map((p) => (
              <Paper
                p="md"
                key={p.text.slice(0, 20)}
                sx={{ marginTop: '30px' }}
              >
                {p.text}
              </Paper>
            ))}
          </Box>
        ))}
      </ScrollArea>
    );
  }

  return null;
};

export default Posts;
