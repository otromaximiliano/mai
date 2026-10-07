import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const correctEmail = "mai@southopenlabs.com";
    const correctPassword = process.env.ADMIN_PIN;

    if (!correctPassword) {
      console.error("ADMIN_PIN no está configurada en las variables de entorno");
      return NextResponse.json(
        {
          success: false,
          error: "Variable de entorno ADMIN_PIN no configurada en el servidor.",
        },
        { status: 500 }
      );
    }

    if (
      email &&
      email.toLowerCase().trim() === correctEmail &&
      password &&
      password === correctPassword
    ) {
      return NextResponse.json({
        success: true,
        message: "Autenticado con éxito",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Credenciales incorrectas. Verifique el email y la contraseña.",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error in POST /api/admin/login:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
