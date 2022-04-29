import React from 'react';
import { AppShell, Navbar, Text } from '@mantine/core';
import NavBarContent from 'Components/NavBarContent';
import Reddit from 'Components/Reddit/Reddit';
import Twitter from 'Components/Twitter/Twitter';
import LinkedIn from 'Components/LinkedIn/LinkedIn';
import { SelectedSite } from '../types';

const sites: Array<SelectedSite> = ['Reddit', 'Twitter', 'LinkedIn'];

function DefaultText() {
  return <Text>Select a Service to Scrape</Text>;
}

interface ShowSelectedProps {
  selected: SelectedSite;
}

function SelectedScraper({ selected }: ShowSelectedProps) {
  if (selected === 'none') return <DefaultText />;

  return (
    <>
      <Reddit show={selected === 'Reddit'} />
      <Twitter show={selected === 'Twitter'} />
      <LinkedIn show={selected === 'LinkedIn'} />
    </>
  );
}

export default function App() {
  const [selected, setSelected] = React.useState<SelectedSite>('none');

  return (
    <AppShell
      sx={{ height: '100vh' }}
      style={{ padding: '0' }}
      navbar={
        <Navbar width={{ base: 300 }} height="98vh">
          <NavBarContent
            sites={sites}
            selected={selected}
            setSelected={setSelected}
          />
        </Navbar>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[2],
        },
      })}
    >
      <SelectedScraper selected={selected} />
    </AppShell>
  );
}
