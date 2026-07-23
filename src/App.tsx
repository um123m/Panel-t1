import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import Shell from './components/layout/Shell';

// Pages
import Dashboard from './pages/Dashboard';
import PlayerSearch from './pages/PlayerSearch';
import Characters from './pages/Characters';
import Vehicles from './pages/Vehicles';
import PlayerAdmin from './pages/PlayerAdmin';
import OnlinePlayers from './pages/OnlinePlayers';
import Gangs from './pages/Gangs';
import Reports from './pages/Reports';
import Queue from './pages/Queue';
import Bans from './pages/Bans';
import Priority from './pages/Priority';
import Weapons from './pages/Weapons';
import Settings from './pages/Settings';
import Placeholder from './pages/Placeholder';

const queryClient = new QueryClient();

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/search" component={PlayerSearch} />
        <Route path="/characters" component={Characters} />
        <Route path="/vehicles" component={Vehicles} />
        <Route path="/player-admin" component={PlayerAdmin} />
        <Route path="/online" component={OnlinePlayers} />
        <Route path="/gangs" component={Gangs} />
        <Route path="/reports" component={Reports} />
        <Route path="/queue" component={Queue} />
        <Route path="/bans" component={Bans} />
        <Route path="/priority" component={Priority} />
        <Route path="/weapons" component={Weapons} />
        <Route path="/settings" component={Settings} />
        
        {/* Placeholders for un-detailed pages */}
        <Route path="/users" component={Placeholder} />
        <Route path="/applications" component={Placeholder} />
        <Route path="/test" component={Placeholder} />
        <Route path="/rules" component={Placeholder} />
        <Route path="/design" component={Placeholder} />
        
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
