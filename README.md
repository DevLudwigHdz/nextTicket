# Boletera - Sistema de Venta de Boletos

Boletera es una aplicación web full-stack para la compra y venta de boletos de eventos. Construida con tecnologías modernas, ofrece una plataforma segura, escalable y fácil de usar tanto para los asistentes como para los promotores y administradores del sitio.

---

## Tabla de Contenidos

1.  [Sobre el Proyecto](#sobre-el-proyecto)
2.  [Arquitectura del Proyecto](#arquitectura-del-proyecto)
    - [Frontend](#frontend)
    - [Backend y Base de Datos](#backend-y-base-de-datos)
    - [Autenticación y Autorización](#autenticación-y-autorización)
3.  [Tecnologías Utilizadas](#tecnologías-utilizadas)
4.  [Primeros Pasos (Getting Started)](#primeros-pasos-getting-started)
    - [Prerrequisitos](#prerrequisitos)
    - [Instalación y Configuración](#instalación-y-configuración)
5.  [Variables de Entorno](#variables-de-entorno)
6.  [Cómo Contribuir](#cómo-contribuir)
7.  [Licencia](#licencia)

---

## Sobre el Proyecto

Este proyecto implementa un sistema completo de venta de boletos con las siguientes características clave:

- **Roles de Usuario:** Control de Acceso Basado en Roles (RBAC) con tres niveles:
  - `attendee` (Asistente): Puede ver eventos y comprar boletos.
  - `promoter` (Promotor): Puede crear y gestionar sus propios eventos.
  - `admin` (Administrador): Tiene control total sobre la plataforma, incluyendo usuarios y eventos.
- **Listado de Eventos:** Los usuarios pueden explorar eventos disponibles, con páginas de detalle para cada uno.
- **Flujo de Compra:** Un sistema simulado (listo para integrar una pasarela de pago) que maneja la creación de pedidos y la asignación de boletos de forma segura.
- **Dashboards Personalizados:** Interfaces específicas para cada rol para gestionar sus tareas correspondientes (ver boletos, gestionar eventos, etc.).

---

## Arquitectura del Proyecto

La aplicación sigue una arquitectura moderna basada en el framework Next.js, aprovechando sus capacidades de renderizado en el servidor y en el cliente, junto con Supabase como backend todo-en-uno.

### Frontend

- **Framework:** **Next.js 14** con **App Router**.
- **Lenguaje:** **TypeScript**.
- **Estilos:** **Tailwind CSS** para un diseño rápido y responsivo.
- **Componentes:** La UI está construida con **React**. Se hace una distinción clara entre:
  - **Server Components:** Usados por defecto para obtener datos de forma segura y rápida directamente desde el servidor. La mayoría de las páginas (`/`, `/events`, `/events/[id]`) son Server Components.
  - **Client Components (`'use client'`):** Usados solo cuando se necesita interactividad en el navegador (e.g., formularios, botones con estado, hooks de React como `useState` y `useEffect`).

### Backend y Base de Datos

- **Backend como Servicio (BaaS):** **Supabase**.
- **Base de Datos:** Una base de datos **PostgreSQL** gestionada por Supabase. Toda la lógica de negocio crucial (como la compra de un boleto) se encapsula en **funciones de PostgreSQL (`plpgsql`)** para garantizar la atomicidad y la seguridad.
- **Interacción con la Base de Datos:**
  - Desde el frontend, la interacción se realiza principalmente a través de **Server Actions** de Next.js. Estas funciones se ejecutan de forma segura en el servidor, evitando exponer lógica sensible o claves de API al cliente.
  - Las Server Actions llaman a la API de Supabase o directamente a las funciones RPC de la base de datos.

### Autenticación y Autorización

- **Autenticación:** Gestionada por **Supabase Auth**. Proporciona un sistema completo para registro, inicio de sesión (con email/contraseña y proveedores OAuth como Google/GitHub) y manejo de sesiones.
- **Autorización (Control de Acceso):** La seguridad es un pilar fundamental de esta arquitectura.
  - **Row Level Security (RLS) de PostgreSQL:** La base de datos es la única fuente de verdad para los permisos. Se han implementado políticas de RLS que aseguran que un usuario solo pueda ver o modificar los datos que le corresponden según su rol. Por ejemplo, un `promoter` no puede modificar eventos de otro promotor a nivel de base de datos.
  - **Middleware de Next.js:** Protege las rutas del frontend. Si un usuario no autenticado o sin el rol adecuado intenta acceder a una ruta de dashboard (e.g., `/dashboard/admin`), el middleware lo redirige.
  - **Cliente de Administrador:** Para tareas que requieren privilegios elevados (como listar todos los usuarios), se utiliza un cliente de Supabase especial en el servidor que usa la `service_role_key` secreta.

---

## Tecnologías Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.io/) (Base de Datos PostgreSQL, Auth, Storage)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)

---

## Primeros Pasos (Getting Started)

Sigue estos pasos para tener una copia del proyecto funcionando en tu máquina local para desarrollo.

### Prerrequisitos

- Node.js (v18 o superior)
- npm (o tu gestor de paquetes preferido)
- Acceso de colaborador al proyecto de Supabase (solicítalo al administrador del repositorio si necesitas acceso directo al dashboard de Supabase).

### Instalación y Configuración

1.  **Clona el repositorio:**

    ```sh
    git clone https://URL_DEL_REPOSITORIO.git
    cd nombre-del-repositorio
    ```

2.  **Instala las dependencias:**

    ```sh
    npm install
    ```

3.  **Configura tus variables de entorno:**

    - El proyecto se conecta a una instancia de desarrollo compartida de Supabase. Necesitarás las claves de la API para conectar tu aplicación local.
    - Ve a la sección [Variables de Entorno](#variables-de-entorno) para más detalles.

4.  **Inicia el servidor de desarrollo:**

    ```sh
    npm run dev
    ```

5.  Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

## Variables de Entorno

La aplicación utiliza un archivo `.env.local` para gestionar las claves de API. **Este archivo no debe ser subido a Git.**

Para que la aplicación se conecte a la instancia de desarrollo de Supabase, necesitarás las claves del proyecto.

**Solicita al administrador del repositorio que te proporcione los valores para las siguientes variables.** Deberás crear un archivo llamado `.env.local` en la raíz del proyecto y añadir el siguiente contenido:

```env
# URL de tu proyecto de Supabase (proporcionada por el admin)
NEXT_PUBLIC_SUPABASE_URL=https://ID_DEL_PROYECTO.supabase.co

# Clave anónima pública del proyecto (proporcionada por el admin)
NEXT_PUBLIC_SUPABASE_ANON_KEY=LA_CLAVE_ANON_PUBLICA

# URL base de tu aplicación para desarrollo
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Clave secreta de servicio para tareas de admin (proporcionada por el admin)
# ¡NUNCA EXPONER ESTA CLAVE EN EL CLIENTE!
SUPABASE_SERVICE_ROLE_KEY=LA_CLAVE_SECRETA_DE_SERVICIO
```

---

## Cómo Contribuir

Las contribuciones son lo que hacen a la comunidad de código abierto un lugar increíble para aprender, inspirar y crear. Cualquier contribución que hagas será **muy apreciada**.

1.  Haz un "Fork" del Proyecto.
2.  Crea tu Rama de Característica (`git checkout -b feature/AmazingFeature`).
3.  Haz "Commit" de tus Cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Haz "Push" a la Rama (`git push origin feature/AmazingFeature`).
5.  Abre una "Pull Request".

---

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.
