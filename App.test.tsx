import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('ThinkSquad AI — Application', () => {
  it('renders the landing page with the launch button', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /launch thinksquad os/i })
    ).toBeInTheDocument();
  });

  it('transitions to the dashboard when the launch button is clicked', async () => {
    render(<App />);
    const launchButton = screen.getByRole('button', { name: /launch thinksquad os/i });
    fireEvent.click(launchButton);

    // Wait for the AnimatePresence exit animation to complete and dashboard to appear
    const demoButton = await screen.findByRole('button', { name: /load judge demo data/i });
    expect(demoButton).toBeInTheDocument();
  });

  it('switches between module tabs correctly', async () => {
    render(<App />);

    // Launch into dashboard
    fireEvent.click(screen.getByRole('button', { name: /launch thinksquad os/i }));
    await screen.findByRole('button', { name: /load judge demo data/i });

    // Default tab is Collab StepGuard — wait for its heading
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /collab stepguard/i })).toBeInTheDocument();
    });

    // Switch to BlindSpot Forensics tab (desktop + mobile both match)
    const blindspotTabs = screen.getAllByRole('button', { name: /blindspot forensics/i });
    fireEvent.click(blindspotTabs[0]);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /blindspot forensics/i })).toBeInTheDocument();
    });

    // Switch to Dependency Graph tab (desktop + mobile both match)
    const graphTabs = screen.getAllByRole('button', { name: /dependency graph/i });
    fireEvent.click(graphTabs[0]);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dependency graph/i })).toBeInTheDocument();
    });
  });

  it('loads demo data when the demo button is clicked', async () => {
    render(<App />);

    // Launch into dashboard
    fireEvent.click(screen.getByRole('button', { name: /launch thinksquad os/i }));
    const demoButton = await screen.findByRole('button', { name: /load judge demo data/i });

    // Click the demo loader button
    fireEvent.click(demoButton);

    // Button text should change to "Demo Data Loaded"
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /demo data loaded/i })
      ).toBeInTheDocument();
    });
  });

  it('opens and closes the telemetry drawer', async () => {
    render(<App />);

    // Launch into dashboard
    fireEvent.click(screen.getByRole('button', { name: /launch thinksquad os/i }));
    await screen.findByRole('button', { name: /load judge demo data/i });

    // Open telemetry drawer
    const telemetryButton = screen.getByRole('button', { name: /open engine telemetry/i });
    fireEvent.click(telemetryButton);

    // Drawer should be visible with its heading
    await waitFor(() => {
      expect(screen.getByText('Engine Telemetry')).toBeInTheDocument();
    });

    // Close it — use getAllByRole since AnimatePresence may keep exit copy briefly
    const closeButtons = screen.getAllByRole('button', { name: /close telemetry drawer/i });
    fireEvent.click(closeButtons[0]);
  });

  it('renders the system health footer with diagnostic checks', async () => {
    render(<App />);

    // Launch into dashboard
    fireEvent.click(screen.getByRole('button', { name: /launch thinksquad os/i }));
    await screen.findByRole('button', { name: /load judge demo data/i });

    // The footer should report system status
    await waitFor(() => {
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveAttribute('data-system-health');
    });
  });
});
