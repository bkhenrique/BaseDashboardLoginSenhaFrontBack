// app/middleware.ts (ou ./middleware.ts se você estiver usando o Pages Router)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parse } from "cookie"; // Importe 'parse'

export function middleware(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || ""; // Pega todos os cookies
  const cookies = parse(cookieHeader); // Analisa os cookies
  const token = cookies.token; // Pega o token
  const { pathname } = request.nextUrl;

  if (token) {
    // Se o token existir...

    if (pathname === "/login" || pathname === "/register" || pathname === "/") {
      // ...e estiver nas páginas de login, registro ou na raiz, redirecione para o dashboard.
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    // Se o token NÃO existir...
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
      // ...e estiver tentando acessar dashboard ou profile, redirecione para o login.
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Se não se encaixar em nenhuma das condições acima, continue para a próxima rota/middleware.
  return NextResponse.next();
}

// Config (opcional, mas recomendado):  Quais rotas o middleware deve interceptar.
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard",
    "/profile",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
