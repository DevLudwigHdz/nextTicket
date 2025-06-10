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
    - [Instalación](#instalación)
5.  [Configuración de Supabase](#configuración-de-supabase)
    - [Paso 1: Crear Proyecto en Supabase](#paso-1-crear-proyecto-en-supabase)
    - [Paso 2: Configurar el Esquema de la Base de Datos](#paso-2-configurar-el-esquema-de-la-base-de-datos)
    - [Paso 3: Configurar la Autenticación](#paso-3-configurar-la-autenticación)
6.  [Variables de Entorno](#variables-de-entorno)
7.  [Cómo Contribuir](#cómo-contribuir)
8.  [Licencia](#licencia)

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

Sigue estos pasos para tener una copia del proyecto funcionando en tu máquina local.

### Prerrequisitos

- Node.js (v18 o superior)
- npm (o tu gestor de paquetes preferido)
- Una cuenta de Supabase ([regístrate gratis aquí](https://supabase.com/dashboard))

### Instalación

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

    - Crea una copia del archivo `.env.local` si no existe.
    - Sigue las instrucciones en la sección [Variables de Entorno](#variables-de-entorno) para rellenar `.env.local`.

4.  **Inicia el servidor de desarrollo:**

    ```sh
    npm run dev
    ```

5.  Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

## Configuración de Supabase

Para que la aplicación funcione, necesitas configurar tu propio proyecto de Supabase.

### Paso 1: Crear Proyecto en Supabase

1.  Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard).
2.  Haz clic en **"New project"**.
3.  Elige un nombre para el proyecto y genera una contraseña de base de datos segura (guárdala, la necesitarás).
4.  Espera a que el proyecto se aprovisione.
5.  Una vez creado, ve a **Settings > API** y copia tu **Project URL** y tu clave **`anon` (public)**. Las necesitarás para el archivo `.env.local`.

### Paso 2: Configurar el Esquema de la Base de Datos

Debes ejecutar los scripts SQL que definen la estructura de la base de datos y la lógica de negocio. Ve al **SQL Editor** en tu dashboard de Supabase y ejecuta los scripts necesarios en el orden correcto (creación de tablas, creación de funciones, creación de triggers). Estos scripts fueron proporcionados durante el desarrollo de este proyecto.

### Paso 3: Configurar la Autenticación

1.  Ve a **Authentication > Providers** en tu dashboard de Supabase.
2.  Habilita los proveedores que desees (Email es el básico). Para proveedores sociales como Google o GitHub:
    - Sigue las guías de Supabase para obtener el Client ID y el Client Secret desde la plataforma del proveedor.
    - Añade la URL de redirección que te proporciona Supabase en la configuración de tu aplicación en la plataforma del proveedor (e.g., Google Cloud Console).
3.  Ve a **Authentication > URL Configuration** y asegúrate de que:
    - **Site URL** esté configurado como `http://localhost:3000` para desarrollo.
    - En **Redirect URLs**, añade `http://localhost:3000/auth/callback`.

---

## Variables de Entorno

La aplicación utiliza un archivo `.env.local` para gestionar las claves de API y otras configuraciones. **Este archivo no debe ser subido a Git.**

Crea un archivo llamado `.env.local` en la raíz del proyecto con el siguiente contenido, reemplazando los valores con tus propias claves de Supabase:

```env
# URL de tu proyecto de Supabase (Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://TU_ID_DE_PROYECTO.supabase.co

# Clave anónima pública de tu proyecto (Settings > API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_CLAVE_ANON_PUBLICA

# URL base de tu aplicación para desarrollo
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Clave secreta de servicio para tareas de admin (Settings > API)
# ¡NUNCA EXPONER ESTA CLAVE EN EL CLIENTE!
SUPABASE_SERVICE_ROLE_KEY=TU_CLAVE_SECRETA_DE_SERVICIO
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
