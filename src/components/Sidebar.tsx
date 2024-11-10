import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { styled } from '@mui/material/styles';

const drawerWidth = 260;

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Services', icon: <BuildIcon />, path: '/services' },
  { label: 'Clients', icon: <PeopleIcon />, path: '/clients' },
  { label: 'Vendors', icon: <LocalShippingIcon />, path: '/vendors' },
];

// Styled component for ListItemButton with hover and selected styling
const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    boxShadow: theme.shadows[1],
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
}));

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5', // Light background color
          color: '#333333', // Dark text color for contrast
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src="../public/new.png" alt="Logo" style={{ width: '70%', maxWidth: 150 }} />
      </Box>

      <Divider />

      {/* Menu Items */}
      <List>
        {menuItems.map((item, index) => (
          <StyledListItemButton
            key={index}
            onClick={() => (window.location.href = item.path)}
            selected={window.location.pathname === item.path}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} sx={{ fontWeight: 500 }} />
          </StyledListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
