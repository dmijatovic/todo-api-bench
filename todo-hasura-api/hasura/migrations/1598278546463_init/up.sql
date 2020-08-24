SET client_encoding = 'UTF8';

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.todo_item (
    id integer NOT NULL,
    title character varying(150) NOT NULL,
    checked boolean DEFAULT false NOT NULL,
    list_id integer NOT NULL
);
CREATE SEQUENCE public.todo_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.todo_item_id_seq OWNED BY public.todo_item.id;
CREATE TABLE public.todo_list (
    id integer NOT NULL,
    title character varying(150) NOT NULL
);
CREATE SEQUENCE public.todo_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.todo_list_id_seq OWNED BY public.todo_list.id;
CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4(),
    roles character varying(100) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    birth_date date NOT NULL,
    createdate date DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT users_email_check CHECK ((length((email)::text) > 5)),
    CONSTRAINT users_password_check CHECK ((length((password)::text) > 5))
);
ALTER TABLE ONLY public.todo_item ALTER COLUMN id SET DEFAULT nextval('public.todo_item_id_seq'::regclass);
ALTER TABLE ONLY public.todo_list ALTER COLUMN id SET DEFAULT nextval('public.todo_list_id_seq'::regclass);
ALTER TABLE ONLY public.todo_item
    ADD CONSTRAINT todo_item_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.todo_list
    ADD CONSTRAINT todo_list_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (email);
ALTER TABLE ONLY public.todo_item
    ADD CONSTRAINT todo_item_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.todo_list(id);
