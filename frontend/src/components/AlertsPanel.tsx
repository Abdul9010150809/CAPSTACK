import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  Stack,
  Divider,
  Alert,
  IconButton,
  Collapse,
  Button
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  ExpandMore,
  ExpandLess,
  NotificationsActive,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[12],
  },
}));

interface Alert {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp?: string;
  actionable?: boolean;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'error': return <Error color="error" />;
    case 'warning': return <Warning color="warning" />;
    case 'success': return <CheckCircle color="success" />;
    default: return <Info color="info" />;
  }
};

const getAlertColor = (type: string) => {
  switch (type) {
    case 'error': return 'error';
    case 'warning': return 'warning';
    case 'success': return 'success';
    default: return 'info';
  }
};

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  const [expanded, setExpanded] = React.useState(false);

  const criticalAlerts = alerts.filter(alert => alert.type === 'error' || alert.type === 'warning');
  const otherAlerts = alerts.filter(alert => alert.type === 'info' || alert.type === 'success');

  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <NotificationsActive color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              AI Financial Alerts
            </Typography>
          </Stack>
          <Chip
            label={`${alerts.length} Active`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* Critical Alerts - Always Visible */}
        {criticalAlerts.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 2 }}>
              ⚠️ REQUIRES ATTENTION
            </Typography>
            <Stack spacing={2}>
              {criticalAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  severity={getAlertColor(alert.type) as any}
                  icon={getAlertIcon(alert.type)}
                  sx={{
                    borderRadius: 2,
                    '& .MuiAlert-icon': { alignItems: 'center' }
                  }}
                  action={
                    alert.actionable && (
                      <Button color="inherit" size="small">
                        Fix Now
                      </Button>
                    )
                  }
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {alert.message}
                  </Typography>
                  {alert.timestamp && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8 }}>
                      {alert.timestamp}
                    </Typography>
                  )}
                </Alert>
              ))}
            </Stack>
          </Box>
        )}

        {/* Other Alerts - Collapsible */}
        {otherAlerts.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  📊 INSIGHTS & UPDATES
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  sx={{ color: 'text.secondary' }}
                >
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              <Collapse in={expanded}>
                <List dense>
                  {otherAlerts.map((alert) => (
                    <ListItem key={alert.id} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {getAlertIcon(alert.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {alert.message}
                          </Typography>
                        }
                        secondary={
                          alert.timestamp && (
                            <Typography variant="caption" color="text.secondary">
                              {alert.timestamp}
                            </Typography>
                          )
                        }
                      />
                      <Chip
                        label={alert.type}
                        size="small"
                        color={getAlertColor(alert.type) as any}
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>

              {!expanded && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', py: 1 }}>
                  {otherAlerts.length} additional insights available
                </Typography>
              )}
            </Box>
          </>
        )}

        {alerts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              All Clear!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your finances are in good shape
            </Typography>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
}