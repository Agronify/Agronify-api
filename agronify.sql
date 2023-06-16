--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Crop; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Crop" (
    id integer NOT NULL,
    image text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    is_fruit boolean NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: CropDisease; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CropDisease" (
    id integer NOT NULL,
    image text NOT NULL,
    crop_id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: CropDisease_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."CropDisease_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: CropDisease_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."CropDisease_id_seq" OWNED BY public."CropDisease".id;


--
-- Name: Crop_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Crop_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Crop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Crop_id_seq" OWNED BY public."Crop".id;


--
-- Name: Knowledge; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Knowledge" (
    id integer NOT NULL,
    image text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    tags text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Knowledge_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Knowledge_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Knowledge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Knowledge_id_seq" OWNED BY public."Knowledge".id;


--
-- Name: MLModel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MLModel" (
    id integer NOT NULL,
    crop_id integer NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    file text NOT NULL,
    active boolean DEFAULT false NOT NULL,
    "inputWidth" integer,
    "inputHeight" integer,
    "classAmount" integer,
    "normalize" boolean DEFAULT false NOT NULL,
    threshold double precision DEFAULT 90,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: MLModel_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."MLModel_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: MLModel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."MLModel_id_seq" OWNED BY public."MLModel".id;


--
-- Name: ModelClass; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ModelClass" (
    id integer NOT NULL,
    mlmodel_id integer NOT NULL,
    disease_id integer,
    index integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ripe boolean DEFAULT false NOT NULL
);


--
-- Name: ModelClass_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ModelClass_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ModelClass_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ModelClass_id_seq" OWNED BY public."ModelClass".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text,
    is_admin boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Crop id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Crop" ALTER COLUMN id SET DEFAULT nextval('public."Crop_id_seq"'::regclass);


--
-- Name: CropDisease id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CropDisease" ALTER COLUMN id SET DEFAULT nextval('public."CropDisease_id_seq"'::regclass);


--
-- Name: Knowledge id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Knowledge" ALTER COLUMN id SET DEFAULT nextval('public."Knowledge_id_seq"'::regclass);


--
-- Name: MLModel id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MLModel" ALTER COLUMN id SET DEFAULT nextval('public."MLModel_id_seq"'::regclass);


--
-- Name: ModelClass id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ModelClass" ALTER COLUMN id SET DEFAULT nextval('public."ModelClass_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, name, email, password, is_admin, "createdAt", "updatedAt") FROM stdin;
1	User	user@agronify.com	$2a$10$2.NtFsAop9jFXB/fsTFfSuvSv75JNErP3rSH0yHPBGmkl8z0.T1Ai	f	2023-05-24 09:58:01.627	2023-05-24 09:58:01.627
2	Admin	admin@agronify.com	$2a$10$4I.GbxUDJgOS6RcAuD1f7uptvPZ/Xe7ERSFtVZIOcSCk2DXplX3CS	t	2023-05-24 10:00:59.509	2023-05-24 10:00:59.509
\.


--
-- Name: CropDisease_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."CropDisease_id_seq"', 1, true);


--
-- Name: Crop_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Crop_id_seq"', 1, true);


--
-- Name: Knowledge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Knowledge_id_seq"', 1, true);


--
-- Name: MLModel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."MLModel_id_seq"', 1, true);


--
-- Name: ModelClass_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ModelClass_id_seq"', 1, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."User_id_seq"', 2, true);


--
-- Name: CropDisease CropDisease_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CropDisease"
    ADD CONSTRAINT "CropDisease_pkey" PRIMARY KEY (id);


--
-- Name: Crop Crop_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Crop"
    ADD CONSTRAINT "Crop_pkey" PRIMARY KEY (id);


--
-- Name: Knowledge Knowledge_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Knowledge"
    ADD CONSTRAINT "Knowledge_pkey" PRIMARY KEY (id);


--
-- Name: MLModel MLModel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MLModel"
    ADD CONSTRAINT "MLModel_pkey" PRIMARY KEY (id);


--
-- Name: ModelClass ModelClass_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ModelClass"
    ADD CONSTRAINT "ModelClass_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: CropDisease CropDisease_crop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CropDisease"
    ADD CONSTRAINT "CropDisease_crop_id_fkey" FOREIGN KEY (crop_id) REFERENCES public."Crop"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MLModel MLModel_crop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MLModel"
    ADD CONSTRAINT "MLModel_crop_id_fkey" FOREIGN KEY (crop_id) REFERENCES public."Crop"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ModelClass ModelClass_disease_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ModelClass"
    ADD CONSTRAINT "ModelClass_disease_id_fkey" FOREIGN KEY (disease_id) REFERENCES public."CropDisease"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ModelClass ModelClass_mlmodel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ModelClass"
    ADD CONSTRAINT "ModelClass_mlmodel_id_fkey" FOREIGN KEY (mlmodel_id) REFERENCES public."MLModel"(id) ON UPDATE CASCADE ON DELETE CASCADE;
