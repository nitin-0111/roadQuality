import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';

const SearchContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar({ pathCoords, setPathCoords, isLoading, setLoading }) {

  const [startPoint, setStartPoint] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  // const [startPoint, setStartPoint] = React.useState('');
  // const [destination, setDestination] = React.useState('');

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

  const handleStartPointChange = (event) => {
    setStartPoint(event.target.value);
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleEnterKeyPress = async (event) => {
    if (event.key === 'Enter') {
      await getLocationCoordinates(startPoint, 'start');
      await getLocationCoordinates(destination, 'destination');
    }
  };

  const handleSubmit = async () => {
    setLoading(true)
    await getLocationCoordinates(startPoint, 'start');
    await getLocationCoordinates(destination, 'destination');
  };

  const getLocationCoordinates = async (location, type) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json&addressdetails=1`);
      const data = await response.json();
      const { lat, lon } = data[0];
      if (type === 'start') {
        setPathCoords(prevState => ({
          ...prevState,
          start: {
            lat: lat,
            lng: lon
          }
        }));
      } else {
        setPathCoords(prevState => ({
          ...prevState,
          dest: {
            lat: lat,
            lng: lon
          }
        }));
      }

      console.log(`${type} Point - Latitude: ${lat}, Longitude: ${lon}`);
    } catch (error) {
      console.error('Error fetching location coordinates:', error);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <AddLocationAltIcon
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </AddLocationAltIcon>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}
          >
            Home
          </Typography>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, mr: 40 }}
          >
            Help
          </Typography>

          <SearchContainer>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Start Point"
                inputProps={{ 'aria-label': 'search' }}
                value={startPoint}
                onChange={handleStartPointChange}
                onKeyDown={handleEnterKeyPress}
              />
            </Search>

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Destination"
                inputProps={{ 'aria-label': 'search' }}
                value={destination}
                onChange={handleDestinationChange}
                onKeyDown={handleEnterKeyPress}
              />
            </Search>

            <Button
              onClick={handleSubmit}
              variant="contained"
              color="secondary"
              style={{ cursor: isLoading ? 'not-allowed' : 'pointer', position: 'relative' }}
              disabled={isLoading}
             
            >
              {isLoading ? 'Searching' : 'Search'}
              {isLoading && <CircularProgress size={24} style={{ position: 'absolute', right: '12px' }} />}
            </Button>      </SearchContainer>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>


            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Render menu components */}
    </Box>
  );
}