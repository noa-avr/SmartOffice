import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { 
  Container, Typography, Button, Table, TableBody, 
  TableCell, TableHead, TableRow, Paper, Box, AppBar, Toolbar 
} from '@mui/material';
import axios from 'axios';
import { authStore } from './stores/authStore';
import LoginForm from './components/LoginForm';

// --- The Dashboard component (the view) ---
// Note: we receive assets and onAdd as parameters
const Dashboard = observer(({ assets, onAdd }: { assets: any[], onAdd: () => void }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', bgcolor: '#f0f4f8' }}>
        <Typography variant="h6">Hello, {authStore.role}</Typography>
        <Button size="small" variant="outlined" color="error" onClick={() => authStore.logout()}>Logout</Button>
      </Paper>

      <Typography variant="h4" gutterBottom>Office Asset Management</Typography>
      
      {authStore.isAdmin ? (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            console.log("Add Asset button clicked in UI"); // Check in Console
            onAdd(); 
          }} 
          sx={{ mb: 3 }}
        >
          Add New Asset (Admin Only)
        </Button>
      ) : (
        <Typography sx={{ color: 'orange', mb: 2 }}>View-only mode - Only Admin can add assets - {authStore.role} user logged in</Typography>
      )}

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset Name</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset, index) => (
              <TableRow key={asset.id || index}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
});

// --- The main component ---
const App = observer(() => {
  const [assets, setAssets] = useState([]); // List of assets

  const fetchAssets = async () => {
    if (!authStore.token) return;
    try {
      const response = await axios.get('http://localhost:5298/assets', {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      setAssets(response.data);
    } catch (error) {
      console.error("Fetch assets failed", error);
    }
  };

  // This is the function that must work
  const handleAddAsset = async () => {
    console.log("handleAddAsset started..."); // This must appear in the Console!
    try {
      const result = await axios.post('http://localhost:5298/assets', 
        { name: `Asset #${assets.length + 1}`, type: "Office Supply" }, 
        { headers: { Authorization: `Bearer ${authStore.token}` } }
      );
      console.log("Response from server:", result.data);
      alert("Asset added successfully!");
      fetchAssets(); // Reload
    } catch (error) {
      console.error("POST request failed", error);
      alert("Failed to add asset. Check server logs.");
    }
  };

  useEffect(() => {
    if (authStore.token) fetchAssets();
  }, [authStore.token]);

  return (
    <Container maxWidth="lg">
      {!authStore.token ? <LoginForm /> : <Dashboard assets={assets} onAdd={handleAddAsset} />}
    </Container>
  );
});

export default App;