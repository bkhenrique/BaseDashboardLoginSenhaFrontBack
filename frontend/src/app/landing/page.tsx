// src/app/landing/page.tsx
"use client";

import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toggleTheme } = useThemeContext();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Bem-vindo ao
      </Typography>
      <Typography variant="h3" gutterBottom>
        BK Solution!
      </Typography>
      <Typography variant="body1" gutterBottom>
        {user
          ? `Você está logado como ${user.email}`
          : "Você não está logado. Por favor, faça login ou registre-se."}
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/login")}
          sx={{ mr: 2 }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => router.push("/register")}
        >
          Registro
        </Button>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Button variant="text" onClick={toggleTheme}>
          Tema Atual: . Clique para alternar.
        </Button>
      </Box>
    </Container>
  );
}
