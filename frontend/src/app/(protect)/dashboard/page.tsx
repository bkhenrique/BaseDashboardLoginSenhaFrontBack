"use client";
import React from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";


const DashboardPage: React.FC = () => {
     const router = useRouter();
  const titulo = "Gerenciamento de Pedidos";
  const conteudo = "Detalhes do pedido serão listados aqui.";
 const {logout } = useAuth();
  const handleLogout = () => {
    logout();
    console.log("Ação executada");
  };
   const handleProfile = () => {
    
     console.log("Ação executada");
     router.push("/profile");
   };

  return (
    <Box padding={3} boxShadow={3} bgcolor="background.paper">
      <Typography variant="h4" gutterBottom>
        {titulo}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {conteudo}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Sair
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleProfile}>
            profile
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
