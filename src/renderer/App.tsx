import { AppShell, Navbar, Text } from '@mantine/core';
import NavBarContent from 'Components/NavBarContent';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Reddit from 'Components/Reddit/Reddit';
import { SelectedSite } from '../types';

const sites: Array<SelectedSite> = ['Reddit', 'Twitter', 'LinkedIn'];

function DefaultText() {
  return <Text>Select a Service to Scrape</Text>;
}

export default function App() {
  return (
    <Router>
      <AppShell
        sx={{ height: '100vh' }}
        style={{ padding: '0' }}
        navbar={
          <Navbar width={{ base: 300 }} height="98vh">
            <NavBarContent sites={sites} />
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
        <Routes>
          <Route path="/" element={<DefaultText />} />
          <Route path="/reddit" element={<Reddit />} />
        </Routes>
      </AppShell>
    </Router>
  );
}
