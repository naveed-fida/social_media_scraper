import {
  Navbar,
  Header,
  Center,
  Title,
  Stack,
  Group,
  Image,
  Text,
} from '@mantine/core';
import { SelectedSite } from '../types';
import icon from '../../assets/icon.png';
import redditIcon from '../../assets/reddit.png';
import twitterIcon from '../../assets/twitter.png';

interface NavBarContentProps {
  sites: Array<SelectedSite>;
  selected: SelectedSite;
  setSelected: React.Dispatch<React.SetStateAction<SelectedSite>>;
}

const icons: Record<string, string> = {
  reddit: redditIcon,
  twitter: twitterIcon,
};

export default function NavBarContent({
  sites,
  selected,
  setSelected,
}: NavBarContentProps) {
  return (
    <>
      <Navbar.Section>
        <Header height="70px">
          <Center style={{ height: '100%' }}>
            <Group>
              <Image src={icon} width="33px" />
              <Title order={3}>Allma&apos;s Scraper</Title>
            </Group>
          </Center>
        </Header>
      </Navbar.Section>
      <Navbar.Section>
        <Stack spacing="xs">
          {sites.map((site) => (
            <Group
              key={site}
              sx={{
                ':hover': { background: '#e9ecef !important' },
                cursor: 'pointer',
              }}
              style={{
                width: '100%',
                height: '50px',
                background: selected === site ? '#e6e6e6' : '#fff',
                cursor: 'pointer',
              }}
              onClick={() => setSelected(site)}
            >
              <Image width="50px" src={icons[site.toLowerCase()]} />
              <Text>{site}</Text>
            </Group>
          ))}
        </Stack>
      </Navbar.Section>
    </>
  );
}
