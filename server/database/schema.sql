--
-- PostgreSQL database dump
--

\restrict SHnwzoHjFAUxAsFoq4Ts2I6g4sktRWw1PPGHv0J4tDQ2L3Cx3dC2CEYZeMR3LB3

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-10-29 11:17:40

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 220 (class 1259 OID 16401)
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id integer CONSTRAINT users_id_not_null NOT NULL,
    name character varying(100) CONSTRAINT users_name_not_null NOT NULL,
    email character varying(150) CONSTRAINT users_email_not_null NOT NULL,
    city character varying(100),
    created_at timestamp with time zone DEFAULT now() CONSTRAINT users_created_at_not_null NOT NULL,
    user_id integer
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 18333)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer CONSTRAINT users_id_not_null1 NOT NULL,
    name character varying CONSTRAINT users_name_not_null1 NOT NULL,
    email character varying(150) CONSTRAINT users_email_not_null1 NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16400)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.contacts.id;


--
-- TOC entry 221 (class 1259 OID 18332)
-- Name: users_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4861 (class 2604 OID 16404)
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4865 (class 2606 OID 16413)
-- Name: contacts users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4869 (class 2606 OID 18346)
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- TOC entry 4867 (class 2606 OID 16411)
-- Name: contacts users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4871 (class 2606 OID 18344)
-- Name: users users_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey1 PRIMARY KEY (id);


--
-- TOC entry 4872 (class 2606 OID 18347)
-- Name: contacts contacts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-10-29 11:17:40

--
-- PostgreSQL database dump complete
--

\unrestrict SHnwzoHjFAUxAsFoq4Ts2I6g4sktRWw1PPGHv0J4tDQ2L3Cx3dC2CEYZeMR3LB3

