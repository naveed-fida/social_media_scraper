import {
  ScrollArea,
  Stack,
  Title,
  Box,
  Paper,
  Loader,
  Button,
} from '@mantine/core';
import { LoadingStatus, FetchedComments } from 'types';

interface CommentsProps {
  status: LoadingStatus;
  comments: FetchedComments;
}

const Comments = ({ status, comments }: CommentsProps) => {
  if (status === 'loading') {
    return <Loader sx={{ marginTop: '30px' }} />;
  }

  if (status === 'fetched') {
    return (
      <ScrollArea>
        <Button
          sx={{ marginTop: '20px' }}
          onClick={() => window.electronAPI.saveRedditComments(comments)}
        >
          Save to File
        </Button>
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
  }

  return null;
};

export default Comments;
