--
-- PostgreSQL database dump
--

\restrict KazLgHcbehNAkOoa7Elw0POIcbQaL26xWh4sNN3ffBzXg8dFJBe0tVZZlYlWMpB

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

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
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(20),
    odoo_partner_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: discounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discounts (
    id integer NOT NULL,
    type character varying(20) NOT NULL,
    value numeric(12,2) NOT NULL,
    minimum_quantity integer DEFAULT 1 NOT NULL,
    start_date date NOT NULL,
    end_date date,
    usage_limit integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT discounts_check CHECK (((end_date IS NULL) OR (end_date >= start_date))),
    CONSTRAINT discounts_check1 CHECK ((((type)::text <> 'PERCENTAGE'::text) OR (value <= (100)::numeric))),
    CONSTRAINT discounts_minimum_quantity_check CHECK ((minimum_quantity > 0)),
    CONSTRAINT discounts_type_check CHECK (((type)::text = ANY ((ARRAY['FIXED'::character varying, 'PERCENTAGE'::character varying])::text[]))),
    CONSTRAINT discounts_usage_limit_check CHECK (((usage_limit IS NULL) OR (usage_limit > 0))),
    CONSTRAINT discounts_value_check CHECK ((value > (0)::numeric))
);


ALTER TABLE public.discounts OWNER TO postgres;

--
-- Name: discounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.discounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.discounts_id_seq OWNER TO postgres;

--
-- Name: discounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.discounts_id_seq OWNED BY public.discounts.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    subscription_id integer NOT NULL,
    odoo_invoice_id integer,
    amount numeric(12,2) NOT NULL,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    due_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT invoices_amount_check CHECK ((amount >= (0)::numeric)),
    CONSTRAINT invoices_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'CONFIRMED'::character varying, 'PAID'::character varying, 'PARTIALLY_PAID'::character varying, 'OVERDUE'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    invoice_id integer NOT NULL,
    odoo_payment_id integer,
    amount numeric(12,2) NOT NULL,
    method character varying(30) NOT NULL,
    paid_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_amount_check CHECK ((amount > (0)::numeric)),
    CONSTRAINT payments_method_check CHECK (((method)::text = ANY ((ARRAY['CASH'::character varying, 'BANK_TRANSFER'::character varying, 'CARD'::character varying, 'UPI'::character varying, 'OTHER'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plans (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    billing_cycle character varying(20) NOT NULL,
    price numeric(12,2) NOT NULL,
    min_quantity integer DEFAULT 1 NOT NULL,
    start_date date,
    end_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT plans_billing_cycle_check CHECK (((billing_cycle)::text = ANY ((ARRAY['DAILY'::character varying, 'WEEKLY'::character varying, 'MONTHLY'::character varying, 'YEARLY'::character varying])::text[]))),
    CONSTRAINT plans_check CHECK (((end_date IS NULL) OR (start_date IS NULL) OR (end_date >= start_date))),
    CONSTRAINT plans_min_quantity_check CHECK ((min_quantity > 0)),
    CONSTRAINT plans_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.plans OWNER TO postgres;

--
-- Name: plans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plans_id_seq OWNER TO postgres;

--
-- Name: plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plans_id_seq OWNED BY public.plans.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    type character varying(30) DEFAULT 'SERVICE'::character varying NOT NULL,
    price numeric(12,2) NOT NULL,
    cost numeric(12,2) DEFAULT 0 NOT NULL,
    odoo_product_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT products_cost_check CHECK ((cost >= (0)::numeric)),
    CONSTRAINT products_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: subscription_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_items (
    id integer NOT NULL,
    subscription_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    CONSTRAINT subscription_items_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT subscription_items_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.subscription_items OWNER TO postgres;

--
-- Name: subscription_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subscription_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscription_items_id_seq OWNER TO postgres;

--
-- Name: subscription_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subscription_items_id_seq OWNED BY public.subscription_items.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    plan_id integer NOT NULL,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    start_date date NOT NULL,
    expiry_date date,
    next_billing_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT subscriptions_check CHECK (((expiry_date IS NULL) OR (expiry_date >= start_date))),
    CONSTRAINT subscriptions_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'QUOTATION'::character varying, 'CONFIRMED'::character varying, 'ACTIVE'::character varying, 'PAUSED'::character varying, 'CLOSED'::character varying])::text[])))
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscriptions_id_seq OWNER TO postgres;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'CUSTOMER'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'STAFF'::character varying, 'CUSTOMER'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
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
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: discounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discounts ALTER COLUMN id SET DEFAULT nextval('public.discounts_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: plans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plans ALTER COLUMN id SET DEFAULT nextval('public.plans_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: subscription_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_items ALTER COLUMN id SET DEFAULT nextval('public.subscription_items_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, name, email, phone, odoo_partner_id, created_at) FROM stdin;
\.


--
-- Data for Name: discounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.discounts (id, type, value, minimum_quantity, start_date, end_date, usage_limit, created_at) FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, subscription_id, odoo_invoice_id, amount, status, due_date, created_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, invoice_id, odoo_payment_id, amount, method, paid_at) FROM stdin;
\.


--
-- Data for Name: plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plans (id, name, billing_cycle, price, min_quantity, start_date, end_date, created_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, type, price, cost, odoo_product_id, created_at) FROM stdin;
\.


--
-- Data for Name: subscription_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_items (id, subscription_id, product_id, quantity, unit_price) FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, customer_id, plan_id, status, start_date, expiry_date, next_billing_date, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, role, created_at) FROM stdin;
\.


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, false);


--
-- Name: discounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discounts_id_seq', 1, false);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plans_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, false);


--
-- Name: subscription_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subscription_items_id_seq', 1, false);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_odoo_partner_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_odoo_partner_id_key UNIQUE (odoo_partner_id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: discounts discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discounts
    ADD CONSTRAINT discounts_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_odoo_invoice_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_odoo_invoice_id_key UNIQUE (odoo_invoice_id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: payments payments_odoo_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_odoo_payment_id_key UNIQUE (odoo_payment_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: products products_odoo_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_odoo_product_id_key UNIQUE (odoo_product_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: subscription_items subscription_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_items
    ADD CONSTRAINT subscription_items_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_customers_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customers_email ON public.customers USING btree (email);


--
-- Name: idx_invoices_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_status ON public.invoices USING btree (status);


--
-- Name: idx_invoices_subscription; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_subscription ON public.invoices USING btree (subscription_id);


--
-- Name: idx_payments_invoice; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_invoice ON public.payments USING btree (invoice_id);


--
-- Name: idx_products_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_name ON public.products USING btree (name);


--
-- Name: idx_subscription_items_subscription; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscription_items_subscription ON public.subscription_items USING btree (subscription_id);


--
-- Name: idx_subscriptions_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscriptions_customer ON public.subscriptions USING btree (customer_id);


--
-- Name: idx_subscriptions_plan; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscriptions_plan ON public.subscriptions USING btree (plan_id);


--
-- Name: idx_subscriptions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscriptions_status ON public.subscriptions USING btree (status);


--
-- Name: invoices fk_invoice_subscription; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT fk_invoice_subscription FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id);


--
-- Name: subscription_items fk_item_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_items
    ADD CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: subscription_items fk_item_subscription; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_items
    ADD CONSTRAINT fk_item_subscription FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON DELETE CASCADE;


--
-- Name: payments fk_payment_invoice; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_payment_invoice FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);


--
-- Name: subscriptions fk_subscription_customer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT fk_subscription_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: subscriptions fk_subscription_plan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT fk_subscription_plan FOREIGN KEY (plan_id) REFERENCES public.plans(id);


--
-- PostgreSQL database dump complete
--

\unrestrict KazLgHcbehNAkOoa7Elw0POIcbQaL26xWh4sNN3ffBzXg8dFJBe0tVZZlYlWMpB

