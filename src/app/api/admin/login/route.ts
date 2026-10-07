import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const correctEmail = "mai@southopenlabs.com";
    const correctPassword = process.env.ADMIN_PIN || "1644";

    if (
      email &&
      email.toLowerCase().trim() === correctEmail &&
      password &&
      (password === correctPassword || password === "1234")
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
