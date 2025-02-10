// src/app/register/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/pt-br";
import { Dayjs } from "dayjs";
import { useAuth } from "@/contexts/AuthContext"; // Importe useAuth
import axios from "axios"; // Importe AxiosError

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { register, loading } = useAuth(); // Use o loading do AuthContext
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    doc: "",
    birthdate: "", // Mantém como string
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client",
    status: "pendente", // Status inicial
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }
    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.surname ||
      !formData.doc ||
      !formData.phone ||
      !selectedDate
    ) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setErrorMessage(""); // Limpa mensagens de erro anteriores

    const birthdateISO = selectedDate ? selectedDate.toISOString() : "";
    const data = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      surname: formData.surname,
      doc: formData.doc,
      phone: formData.phone,
      birthdate: birthdateISO,
    };

    try {
      const result = await register(data); // Chama a função register

      if (result.data) {
        // Verifica se a requisição foi bem-sucedida
        setSuccessMessage(
          "Conta criada com sucesso! Redirecionando para o login..."
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
      // Remova o else daqui. O tratamento de erros vai para o catch.
    } catch (error) {
      // Trata o erro AQUI
      if (axios.isAxiosError(error) && error.response) {
        // Verifica se é um erro do Axios e se tem resposta
        //Erro 409 tratado
        if (error.response.status === 409) {
          setErrorMessage(
            error.response.data.message || "Este email já está cadastrado."
          );
        } else if (error.response.status === 401) {
          setErrorMessage(
            error.response.data.message || "Erro não autorizado."
          );
        } else if (error.response.status === 400) {
          setErrorMessage(
            error.response.data.message || "Todos os campos são Obrigatórios"
          );
        } else if (error.response.data && error.response.data.message) {
          // Se o backend enviou uma mensagem de erro, use-a
          setErrorMessage(error.response.data.message);
        } else {
          // Se não houver mensagem específica, use uma mensagem genérica
          setErrorMessage("Erro ao criar conta.");
        }
      } else {
        // Outros erros (ex: erro de rede)
        setErrorMessage("Erro ao criar conta.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Cadastro
        </Typography>
        {errorMessage && (
          <Typography variant="subtitle1" color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography variant="subtitle1" color="success" sx={{ mb: 2 }}>
            {successMessage}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            label="Nome"
            name="name"
            type="text"
            fullWidth
            margin="normal"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Sobrenome"
            name="surname"
            type="text"
            fullWidth
            margin="normal"
            required
            value={formData.surname}
            onChange={handleChange}
          />
          <TextField
            label="Documento (CPF/CNPJ)"
            name="doc"
            type="text"
            fullWidth
            margin="normal"
            required
            value={formData.doc}
            onChange={handleChange}
          />
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <DatePicker
              label="Data de Nascimento"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              format="DD/MM/YYYY"
              sx={{ width: "100%", marginTop: 2 }}
            />
          </LocalizationProvider>

          <TextField
            label="Telefone"
            name="phone"
            type="text"
            fullWidth
            margin="normal"
            required
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={formData.email}
            onChange={handleChange}
            autoComplete="username"
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
            autoComplete="new-password"
          />
          <TextField
            label="Confirmar Senha"
            name="confirmPassword"
            type="password"
            fullWidth
            margin="normal"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading} // Desabilita o botão durante o carregamento
          >
            Cadastrar
          </Button>
        </Box>
        <Button
          onClick={() => router.push("/login")}
          sx={{ mt: 3 }}
          color="secondary"
        >
          Já tem uma conta? Faça login
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
