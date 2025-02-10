"use client";
import { useAuth } from "@/contexts/AuthContext";
import { getUserById, UserData } from "@/services/users/user.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material"; // Importe os componentes MUI
import dayjs from "dayjs"; // Instale: npm install dayjs
import "dayjs/locale/pt-br"; // Importe o locale pt-br
import { styled } from "@mui/material/styles"; // Importe styled para criar componentes estilizados

// Componente estilizado para o item da lista (opcional, mas recomendado)
const StyledListItem = styled(ListItem)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    fontWeight: "bold",
  },
}));

export default function UserProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.id) {
          const response = await getUserById(user.id);
          setUserInfo(response.data);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!user) {
    return null; // Ou redirecione com useEffect
  }

  if (!userInfo) {
    return <div>Carregando perfil...</div>;
  }

  // Formata a data de nascimento
  const formattedBirthdate = dayjs(userInfo.birthdate)
    .locale("pt-br")
    .format("DD/MM/YYYY");
  const formattedCreatedAt = dayjs(userInfo.createdAt)
    .locale("pt-br")
    .format("DD/MM/YYYY HH:mm");
  const formattedUpdatedAt = dayjs(userInfo.updatedAt)
    .locale("pt-br")
    .format("DD/MM/YYYY HH:mm");

  return (
    <Container maxWidth="md">
      {" "}
      {/* Use 'md' ou outro valor para um layout mais amplo */}
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Perfil de {userInfo.name} {userInfo.surname}
        </Typography>
        <Avatar
          alt={userInfo.name}
          src="/static/images/avatar/1.jpg" // Coloque um placeholder ou a URL da imagem do usuário
          sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
        />

        <List>
          <StyledListItem>
            <ListItemText
              primary="Nome Completo"
              secondary={`${userInfo.name} ${userInfo.surname}`}
            />
          </StyledListItem>
          <Divider />
          <StyledListItem>
            <ListItemText primary="Email" secondary={userInfo.email} />
          </StyledListItem>
          <Divider />
          <StyledListItem>
            <ListItemText
              primary="Documento (CPF/CNPJ)"
              secondary={userInfo.doc}
            />
          </StyledListItem>
          <Divider />
          <StyledListItem>
            <ListItemText primary="Telefone" secondary={userInfo.phone} />
          </StyledListItem>
          <Divider />
          <StyledListItem>
            <ListItemText
              primary="Data de Nascimento"
              secondary={formattedBirthdate}
            />
          </StyledListItem>
          <Divider />

          <StyledListItem>
            <ListItemText
              primary="Função (Role)"
              secondary={userInfo.role === "master" ? "Master" : userInfo.role}
            />
          </StyledListItem>
          <Divider />
          <StyledListItem>
            <ListItemText primary="Status" secondary={userInfo.status} />
          </StyledListItem>
          <Divider />
          <StyledListItem>
            <ListItemText primary="Criado em" secondary={formattedCreatedAt} />
          </StyledListItem>
          <Divider />
          <StyledListItem>
            <ListItemText
              primary="Atualizado em"
              secondary={formattedUpdatedAt}
            />
          </StyledListItem>
        </List>

        {/* Conteúdo condicional para 'master' */}
        {user.role === "master" && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Conteúdo Exclusivo para Master
            </Typography>
            {/* Adicione o conteúdo exclusivo aqui */}
            <p>Este conteúdo só é visível para usuários com a role 'master'.</p>
          </Box>
        )}
      </Box>
    </Container>
  );
}
