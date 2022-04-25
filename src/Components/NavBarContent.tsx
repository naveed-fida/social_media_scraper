import { useState } from 'react';
import {
  Navbar,
  Header,
  Center,
  Title,
  Stack,
  Group,
  Image,
  Anchor,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { SelectedSite } from '../types';
import icon from '../../assets/icon.png';

interface NavBarContentProps {
  sites: Array<SelectedSite>;
}

export default function NavBarContent({ sites }: NavBarContentProps) {
  const [selectedSite, setSeletedSite] = useState<SelectedSite>('none');

  return (
    <>
      <Navbar.Section>
        <Header height="70px">
          <Center style={{ height: '100%' }}>
            <Group>
              <Image src={icon} width="40px" />
              <Title order={3}>Allma&apos;s Scraper</Title>
            </Group>
          </Center>
        </Header>
      </Navbar.Section>
      <Navbar.Section>
        <Stack spacing="xs">
          {sites.map((site) => (
            <Center
              key={site}
              style={{
                width: '100%',
                height: '50px',
                background: selectedSite === site ? '#e6e6e6' : '#fff',
                cursor: 'pointer',
              }}
              onClick={() => setSeletedSite(site)}
            >
              <Anchor to={`/${site.toLowerCase()}`} component={Link}>
                {site}
              </Anchor>
            </Center>
          ))}
        </Stack>
      </Navbar.Section>
    </>
  );
}
