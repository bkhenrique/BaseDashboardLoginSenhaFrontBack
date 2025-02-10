// Exemplo: components/Login.tsx (ou pages/login.tsx)
"use client";
import {  useState } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Ajuste o caminho
import { useRouter } from "next/navigation";
import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
} from "@mui/icons-material";


export default function LoginPage() {
 const { login } = useAuth(); // Use o loading do AuthContext
 const router = useRouter();
 const [error, setError] = useState<string | null>(null);
 const [formData, setFormData] = useState({ email: "", password: "" });
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await login({ email: formData.email, password: formData.password });
      router.push("/dashboard"); // Redireciona após o login
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {error && (
          <Typography variant="subtitle1" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <TextField
            label="Senha"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={formData.password}
            onChange={handleChange}
            autoComplete="password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Entrar
          </Button>
        </Box>
        <Typography variant="subtitle1" sx={{ mt: 3 }}>
          Ou acesse com:
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" fullWidth startIcon={<GoogleIcon />}>
              Google
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" fullWidth startIcon={<FacebookIcon />}>
              Facebook
            </Button>
          </Grid>
        </Grid>
        <Button
          onClick={() => router.push("/register")}
          sx={{ mt: 3 }}
          color="secondary"
        >
          Não tem uma conta? Cadastre-se
        </Button>
      </Box>
    </Container>
  );
};

