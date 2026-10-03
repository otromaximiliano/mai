import Link from "next/link";
import { siteConfig } from "@/config/site-config";
import { MessageCircle, Clock, MapPin, Truck, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    siteConfig.whatsapp.welcomeMessage
  )}`;

  return (
    <footer className="bg-apple-gray text-apple-dark border-t border-black/5 pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-apple-dark text-white flex items-center justify-center font-bold text-xs">
                Ñ
              </div>
              <span className="font-bold text-lg tracking-tight">{siteConfig.brand.name}</span>
            </div>
            <p className="text-xs text-apple-muted leading-relaxed">
              {siteConfig.brand.description}
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Atención: {siteConfig.whatsapp.displayPhoneNumber}</span>
              </a>
            </div>
          </div>

          {/* Delivery & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-apple-muted">
              Envíos y Garantía
            </h4>
            <ul className="space-y-2 text-xs text-apple-muted">
              <li className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-apple-dark shrink-0 mt-0.5" />
                <span>{siteConfig.business.deliveryInfo}</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-apple-dark shrink-0 mt-0.5" />
                <span>Productos originales seleccionados de primera calidad.</span>
              </li>
            </ul>
          </div>

          {/* Business Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-apple-muted">
              Ubicación y Horarios
            </h4>
            <ul className="space-y-2 text-xs text-apple-muted">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-apple-dark shrink-0 mt-0.5" />
                <span>{siteConfig.business.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-apple-dark shrink-0 mt-0.5" />
                <span>{siteConfig.business.hours}</span>
              </li>
            </ul>
          </div>

          {/* Direct Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-apple-muted">
              Administración
            </h4>
            <p className="text-xs text-apple-muted leading-relaxed">
              Accede al panel para actualizar precios, activar o pausar stock y cargar nuevos productos.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white text-apple-dark border border-black/10 hover:bg-apple-subtle transition-colors shadow-2xs"
            >
              <span>Acceso Administrador</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-apple-muted">
          <p>© {new Date().getFullYear()} {siteConfig.brand.name}. Todos los derechos reservados.</p>
          <p className="text-center sm:text-right">
            Desplegado en <span className="font-semibold text-apple-dark">{siteConfig.brand.domain}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
