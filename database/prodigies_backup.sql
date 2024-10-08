PGDMP                      |         	   prodigies    16.1    16.1 S    Y           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            Z           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            [           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            \           1262    16557 	   prodigies    DATABASE     |   CREATE DATABASE prodigies WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
    DROP DATABASE prodigies;
                postgres    false            �            1259    16596    email_verification_otps    TABLE     �   CREATE TABLE public.email_verification_otps (
    evo_id integer NOT NULL,
    email character varying(50),
    otp character varying(25),
    created_at timestamp without time zone
);
 +   DROP TABLE public.email_verification_otps;
       public         heap    postgres    false            �            1259    16595 "   email_verification_otps_evo_id_seq    SEQUENCE     �   CREATE SEQUENCE public.email_verification_otps_evo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.email_verification_otps_evo_id_seq;
       public          postgres    false    218            ]           0    0 "   email_verification_otps_evo_id_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.email_verification_otps_evo_id_seq OWNED BY public.email_verification_otps.evo_id;
          public          postgres    false    217            �            1259    16796    equipmentrental    TABLE     �  CREATE TABLE public.equipmentrental (
    er_id integer NOT NULL,
    uid integer NOT NULL,
    equipment_name character varying(255),
    equipment_description text,
    equipment_condition character varying(50),
    rental_location character varying(255),
    rental_price numeric(10,2) NOT NULL,
    payment_terms character varying(255),
    usage_restrictions text,
    owner_name character varying(255),
    contact_number character varying(20),
    contact_email character varying(255),
    aadhar_card_url text,
    kisan_credit_card_url text,
    pickup_delivery_options character varying(255),
    additional_accessories text,
    insurance_details text,
    terms_conditions text,
    total_requests integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    availability integer DEFAULT 0
);
 #   DROP TABLE public.equipmentrental;
       public         heap    postgres    false            �            1259    16795    equipmentrental_er_id_seq    SEQUENCE     �   CREATE SEQUENCE public.equipmentrental_er_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.equipmentrental_er_id_seq;
       public          postgres    false    232            ^           0    0    equipmentrental_er_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.equipmentrental_er_id_seq OWNED BY public.equipmentrental.er_id;
          public          postgres    false    231            �            1259    16703    farmers_profile_management    TABLE     �  CREATE TABLE public.farmers_profile_management (
    fid integer NOT NULL,
    uid integer,
    up_id integer,
    farm_name character varying(255),
    farm_size numeric(10,2),
    crops_grown text,
    farm_type character varying(50),
    irrigation_methods text,
    storage_facilities text,
    live_stocks jsonb,
    farming_methods character varying(50),
    pesticides_used jsonb
);
 .   DROP TABLE public.farmers_profile_management;
       public         heap    postgres    false            �            1259    16702 "   farmers_profile_management_fid_seq    SEQUENCE     �   CREATE SEQUENCE public.farmers_profile_management_fid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.farmers_profile_management_fid_seq;
       public          postgres    false    222            _           0    0 "   farmers_profile_management_fid_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.farmers_profile_management_fid_seq OWNED BY public.farmers_profile_management.fid;
          public          postgres    false    221            �            1259    16812    issues    TABLE     '  CREATE TABLE public.issues (
    issue_id integer NOT NULL,
    resident_name character varying(255) NOT NULL,
    contact_info character varying(255) NOT NULL,
    address text NOT NULL,
    issue_type character varying(50) NOT NULL,
    issue_description text NOT NULL,
    issue_location character varying(255) NOT NULL,
    issue_date timestamp without time zone NOT NULL,
    images text,
    priority_level character varying(20) DEFAULT 'Medium'::character varying,
    additional_comments text,
    uid integer,
    status integer DEFAULT 0
);
    DROP TABLE public.issues;
       public         heap    postgres    false            �            1259    16811    issues_issue_id_seq    SEQUENCE     �   CREATE SEQUENCE public.issues_issue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.issues_issue_id_seq;
       public          postgres    false    234            `           0    0    issues_issue_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.issues_issue_id_seq OWNED BY public.issues.issue_id;
          public          postgres    false    233            �            1259    16712    jobs    TABLE     Y  CREATE TABLE public.jobs (
    jid integer NOT NULL,
    uid integer NOT NULL,
    jobtitle character varying(255) NOT NULL,
    jobdescription text NOT NULL,
    joblocation character varying(255) NOT NULL,
    startdate date NOT NULL,
    enddate date,
    workinghours character varying(50) NOT NULL,
    wagesalary character varying(50) NOT NULL,
    qualificationsskills text,
    applicationdeadline date NOT NULL,
    aadharcard character varying(255),
    kissancard character varying(255),
    posteddate timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status integer DEFAULT 0
);
    DROP TABLE public.jobs;
       public         heap    postgres    false            �            1259    16734    jobs_application_tracker    TABLE     �   CREATE TABLE public.jobs_application_tracker (
    jpt_id integer NOT NULL,
    jid integer,
    who_applied integer,
    job_status integer DEFAULT 0,
    applied_date timestamp without time zone DEFAULT now()
);
 ,   DROP TABLE public.jobs_application_tracker;
       public         heap    postgres    false            �            1259    16733 #   jobs_application_tracker_jpt_id_seq    SEQUENCE     �   CREATE SEQUENCE public.jobs_application_tracker_jpt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.jobs_application_tracker_jpt_id_seq;
       public          postgres    false    228            a           0    0 #   jobs_application_tracker_jpt_id_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.jobs_application_tracker_jpt_id_seq OWNED BY public.jobs_application_tracker.jpt_id;
          public          postgres    false    227            �            1259    16711    jobs_jid_seq    SEQUENCE     �   CREATE SEQUENCE public.jobs_jid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.jobs_jid_seq;
       public          postgres    false    224            b           0    0    jobs_jid_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.jobs_jid_seq OWNED BY public.jobs.jid;
          public          postgres    false    223            �            1259    16723    labourers_profile_management    TABLE     �   CREATE TABLE public.labourers_profile_management (
    lid integer NOT NULL,
    uid integer,
    up_id integer,
    skills character varying(255),
    qualification character varying(255),
    experience text
);
 0   DROP TABLE public.labourers_profile_management;
       public         heap    postgres    false            �            1259    16722 $   labourers_profile_management_lid_seq    SEQUENCE     �   CREATE SEQUENCE public.labourers_profile_management_lid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.labourers_profile_management_lid_seq;
       public          postgres    false    226            c           0    0 $   labourers_profile_management_lid_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.labourers_profile_management_lid_seq OWNED BY public.labourers_profile_management.lid;
          public          postgres    false    225            �            1259    16767    requests    TABLE     )  CREATE TABLE public.requests (
    request_id integer NOT NULL,
    er_id integer,
    uid integer,
    request_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    if_rented integer DEFAULT 0,
    rented_date timestamp without time zone,
    return_date timestamp without time zone
);
    DROP TABLE public.requests;
       public         heap    postgres    false            �            1259    16766    requests_request_id_seq    SEQUENCE     �   CREATE SEQUENCE public.requests_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.requests_request_id_seq;
       public          postgres    false    230            d           0    0    requests_request_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.requests_request_id_seq OWNED BY public.requests.request_id;
          public          postgres    false    229            �            1259    16685    user_profiles    TABLE     �  CREATE TABLE public.user_profiles (
    up_id integer NOT NULL,
    uid integer,
    dob date,
    gender character varying(50),
    village character varying(100),
    taluka character varying(100),
    district character varying(100),
    state character varying(100),
    pincode character varying(20),
    aadharcardfront text,
    aadharcardback text,
    profile_img character varying(255)
);
 !   DROP TABLE public.user_profiles;
       public         heap    postgres    false            �            1259    16684    user_profiles_up_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_profiles_up_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.user_profiles_up_id_seq;
       public          postgres    false    220            e           0    0    user_profiles_up_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.user_profiles_up_id_seq OWNED BY public.user_profiles.up_id;
          public          postgres    false    219            �            1259    16559    users    TABLE     �   CREATE TABLE public.users (
    uid integer NOT NULL,
    name character varying(50),
    email character varying(50),
    phone_number character varying(50),
    user_type integer
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16558    users_uid_seq    SEQUENCE     �   CREATE SEQUENCE public.users_uid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.users_uid_seq;
       public          postgres    false    216            f           0    0    users_uid_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.users_uid_seq OWNED BY public.users.uid;
          public          postgres    false    215            ~           2604    16599    email_verification_otps evo_id    DEFAULT     �   ALTER TABLE ONLY public.email_verification_otps ALTER COLUMN evo_id SET DEFAULT nextval('public.email_verification_otps_evo_id_seq'::regclass);
 M   ALTER TABLE public.email_verification_otps ALTER COLUMN evo_id DROP DEFAULT;
       public          postgres    false    217    218    218            �           2604    16799    equipmentrental er_id    DEFAULT     ~   ALTER TABLE ONLY public.equipmentrental ALTER COLUMN er_id SET DEFAULT nextval('public.equipmentrental_er_id_seq'::regclass);
 D   ALTER TABLE public.equipmentrental ALTER COLUMN er_id DROP DEFAULT;
       public          postgres    false    232    231    232            �           2604    16706    farmers_profile_management fid    DEFAULT     �   ALTER TABLE ONLY public.farmers_profile_management ALTER COLUMN fid SET DEFAULT nextval('public.farmers_profile_management_fid_seq'::regclass);
 M   ALTER TABLE public.farmers_profile_management ALTER COLUMN fid DROP DEFAULT;
       public          postgres    false    222    221    222            �           2604    16815    issues issue_id    DEFAULT     r   ALTER TABLE ONLY public.issues ALTER COLUMN issue_id SET DEFAULT nextval('public.issues_issue_id_seq'::regclass);
 >   ALTER TABLE public.issues ALTER COLUMN issue_id DROP DEFAULT;
       public          postgres    false    234    233    234            �           2604    16715    jobs jid    DEFAULT     d   ALTER TABLE ONLY public.jobs ALTER COLUMN jid SET DEFAULT nextval('public.jobs_jid_seq'::regclass);
 7   ALTER TABLE public.jobs ALTER COLUMN jid DROP DEFAULT;
       public          postgres    false    224    223    224            �           2604    16737    jobs_application_tracker jpt_id    DEFAULT     �   ALTER TABLE ONLY public.jobs_application_tracker ALTER COLUMN jpt_id SET DEFAULT nextval('public.jobs_application_tracker_jpt_id_seq'::regclass);
 N   ALTER TABLE public.jobs_application_tracker ALTER COLUMN jpt_id DROP DEFAULT;
       public          postgres    false    227    228    228            �           2604    16726     labourers_profile_management lid    DEFAULT     �   ALTER TABLE ONLY public.labourers_profile_management ALTER COLUMN lid SET DEFAULT nextval('public.labourers_profile_management_lid_seq'::regclass);
 O   ALTER TABLE public.labourers_profile_management ALTER COLUMN lid DROP DEFAULT;
       public          postgres    false    226    225    226            �           2604    16770    requests request_id    DEFAULT     z   ALTER TABLE ONLY public.requests ALTER COLUMN request_id SET DEFAULT nextval('public.requests_request_id_seq'::regclass);
 B   ALTER TABLE public.requests ALTER COLUMN request_id DROP DEFAULT;
       public          postgres    false    229    230    230                       2604    16688    user_profiles up_id    DEFAULT     z   ALTER TABLE ONLY public.user_profiles ALTER COLUMN up_id SET DEFAULT nextval('public.user_profiles_up_id_seq'::regclass);
 B   ALTER TABLE public.user_profiles ALTER COLUMN up_id DROP DEFAULT;
       public          postgres    false    220    219    220            }           2604    16562 	   users uid    DEFAULT     f   ALTER TABLE ONLY public.users ALTER COLUMN uid SET DEFAULT nextval('public.users_uid_seq'::regclass);
 8   ALTER TABLE public.users ALTER COLUMN uid DROP DEFAULT;
       public          postgres    false    216    215    216            F          0    16596    email_verification_otps 
   TABLE DATA           Q   COPY public.email_verification_otps (evo_id, email, otp, created_at) FROM stdin;
    public          postgres    false    218   �l       T          0    16796    equipmentrental 
   TABLE DATA           �  COPY public.equipmentrental (er_id, uid, equipment_name, equipment_description, equipment_condition, rental_location, rental_price, payment_terms, usage_restrictions, owner_name, contact_number, contact_email, aadhar_card_url, kisan_credit_card_url, pickup_delivery_options, additional_accessories, insurance_details, terms_conditions, total_requests, created_at, updated_at, availability) FROM stdin;
    public          postgres    false    232   �m       J          0    16703    farmers_profile_management 
   TABLE DATA           �   COPY public.farmers_profile_management (fid, uid, up_id, farm_name, farm_size, crops_grown, farm_type, irrigation_methods, storage_facilities, live_stocks, farming_methods, pesticides_used) FROM stdin;
    public          postgres    false    222   .r       V          0    16812    issues 
   TABLE DATA           �   COPY public.issues (issue_id, resident_name, contact_info, address, issue_type, issue_description, issue_location, issue_date, images, priority_level, additional_comments, uid, status) FROM stdin;
    public          postgres    false    234   Gt       L          0    16712    jobs 
   TABLE DATA           �   COPY public.jobs (jid, uid, jobtitle, jobdescription, joblocation, startdate, enddate, workinghours, wagesalary, qualificationsskills, applicationdeadline, aadharcard, kissancard, posteddate, status) FROM stdin;
    public          postgres    false    224   �x       P          0    16734    jobs_application_tracker 
   TABLE DATA           f   COPY public.jobs_application_tracker (jpt_id, jid, who_applied, job_status, applied_date) FROM stdin;
    public          postgres    false    228   �|       N          0    16723    labourers_profile_management 
   TABLE DATA           j   COPY public.labourers_profile_management (lid, uid, up_id, skills, qualification, experience) FROM stdin;
    public          postgres    false    226   8}       R          0    16767    requests 
   TABLE DATA           m   COPY public.requests (request_id, er_id, uid, request_date, if_rented, rented_date, return_date) FROM stdin;
    public          postgres    false    230   !       H          0    16685    user_profiles 
   TABLE DATA           �   COPY public.user_profiles (up_id, uid, dob, gender, village, taluka, district, state, pincode, aadharcardfront, aadharcardback, profile_img) FROM stdin;
    public          postgres    false    220   f       D          0    16559    users 
   TABLE DATA           J   COPY public.users (uid, name, email, phone_number, user_type) FROM stdin;
    public          postgres    false    216   �       g           0    0 "   email_verification_otps_evo_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.email_verification_otps_evo_id_seq', 94, true);
          public          postgres    false    217            h           0    0    equipmentrental_er_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.equipmentrental_er_id_seq', 10, true);
          public          postgres    false    231            i           0    0 "   farmers_profile_management_fid_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.farmers_profile_management_fid_seq', 9, true);
          public          postgres    false    221            j           0    0    issues_issue_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.issues_issue_id_seq', 24, true);
          public          postgres    false    233            k           0    0 #   jobs_application_tracker_jpt_id_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.jobs_application_tracker_jpt_id_seq', 27, true);
          public          postgres    false    227            l           0    0    jobs_jid_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.jobs_jid_seq', 9, true);
          public          postgres    false    223            m           0    0 $   labourers_profile_management_lid_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.labourers_profile_management_lid_seq', 11, true);
          public          postgres    false    225            n           0    0    requests_request_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.requests_request_id_seq', 2, true);
          public          postgres    false    229            o           0    0    user_profiles_up_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.user_profiles_up_id_seq', 16, true);
          public          postgres    false    219            p           0    0    users_uid_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.users_uid_seq', 20, true);
          public          postgres    false    215            �           2606    16601 4   email_verification_otps email_verification_otps_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.email_verification_otps
    ADD CONSTRAINT email_verification_otps_pkey PRIMARY KEY (evo_id);
 ^   ALTER TABLE ONLY public.email_verification_otps DROP CONSTRAINT email_verification_otps_pkey;
       public            postgres    false    218            �           2606    16806 $   equipmentrental equipmentrental_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.equipmentrental
    ADD CONSTRAINT equipmentrental_pkey PRIMARY KEY (er_id);
 N   ALTER TABLE ONLY public.equipmentrental DROP CONSTRAINT equipmentrental_pkey;
       public            postgres    false    232            �           2606    16808 '   equipmentrental equipmentrental_uid_key 
   CONSTRAINT     a   ALTER TABLE ONLY public.equipmentrental
    ADD CONSTRAINT equipmentrental_uid_key UNIQUE (uid);
 Q   ALTER TABLE ONLY public.equipmentrental DROP CONSTRAINT equipmentrental_uid_key;
       public            postgres    false    232            �           2606    16710 :   farmers_profile_management farmers_profile_management_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY public.farmers_profile_management
    ADD CONSTRAINT farmers_profile_management_pkey PRIMARY KEY (fid);
 d   ALTER TABLE ONLY public.farmers_profile_management DROP CONSTRAINT farmers_profile_management_pkey;
       public            postgres    false    222            �           2606    16820    issues issues_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.issues
    ADD CONSTRAINT issues_pkey PRIMARY KEY (issue_id);
 <   ALTER TABLE ONLY public.issues DROP CONSTRAINT issues_pkey;
       public            postgres    false    234            �           2606    16739 6   jobs_application_tracker jobs_application_tracker_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.jobs_application_tracker
    ADD CONSTRAINT jobs_application_tracker_pkey PRIMARY KEY (jpt_id);
 `   ALTER TABLE ONLY public.jobs_application_tracker DROP CONSTRAINT jobs_application_tracker_pkey;
       public            postgres    false    228            �           2606    16721    jobs jobs_pkey 
   CONSTRAINT     M   ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (jid);
 8   ALTER TABLE ONLY public.jobs DROP CONSTRAINT jobs_pkey;
       public            postgres    false    224            �           2606    16730 >   labourers_profile_management labourers_profile_management_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public.labourers_profile_management
    ADD CONSTRAINT labourers_profile_management_pkey PRIMARY KEY (lid);
 h   ALTER TABLE ONLY public.labourers_profile_management DROP CONSTRAINT labourers_profile_management_pkey;
       public            postgres    false    226            �           2606    16773    requests requests_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (request_id);
 @   ALTER TABLE ONLY public.requests DROP CONSTRAINT requests_pkey;
       public            postgres    false    230            �           2606    16745    user_profiles unique_uid 
   CONSTRAINT     R   ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT unique_uid UNIQUE (uid);
 B   ALTER TABLE ONLY public.user_profiles DROP CONSTRAINT unique_uid;
       public            postgres    false    220            �           2606    16747 0   farmers_profile_management unique_uid_constraint 
   CONSTRAINT     j   ALTER TABLE ONLY public.farmers_profile_management
    ADD CONSTRAINT unique_uid_constraint UNIQUE (uid);
 Z   ALTER TABLE ONLY public.farmers_profile_management DROP CONSTRAINT unique_uid_constraint;
       public            postgres    false    222            �           2606    16732 )   labourers_profile_management unique_up_id 
   CONSTRAINT     e   ALTER TABLE ONLY public.labourers_profile_management
    ADD CONSTRAINT unique_up_id UNIQUE (up_id);
 S   ALTER TABLE ONLY public.labourers_profile_management DROP CONSTRAINT unique_up_id;
       public            postgres    false    226            �           2606    16690     user_profiles user_profiles_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (up_id);
 J   ALTER TABLE ONLY public.user_profiles DROP CONSTRAINT user_profiles_pkey;
       public            postgres    false    220            �           2606    16564    users users_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            �           1259    16789    idx_request_er_id    INDEX     G   CREATE INDEX idx_request_er_id ON public.requests USING btree (er_id);
 %   DROP INDEX public.idx_request_er_id;
       public            postgres    false    230            �           1259    16790    idx_request_user_id    INDEX     G   CREATE INDEX idx_request_user_id ON public.requests USING btree (uid);
 '   DROP INDEX public.idx_request_user_id;
       public            postgres    false    230            �           1259    16788    idx_user_email    INDEX     A   CREATE INDEX idx_user_email ON public.users USING btree (email);
 "   DROP INDEX public.idx_user_email;
       public            postgres    false    216            �           1259    16787    idx_user_name    INDEX     ?   CREATE INDEX idx_user_name ON public.users USING btree (name);
 !   DROP INDEX public.idx_user_name;
       public            postgres    false    216            �           2606    16779    requests requests_uid_fkey    FK CONSTRAINT     v   ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_uid_fkey FOREIGN KEY (uid) REFERENCES public.users(uid);
 D   ALTER TABLE ONLY public.requests DROP CONSTRAINT requests_uid_fkey;
       public          postgres    false    230    216    4758            F   &  x�u�KN�@�u�\�#��Ϊaڈ�JR���(i%o?��o;6��i�o��~�?O�0��ejP�����m�dr���t[2���r�Q��ܜ��_���Ɣ�0�B�$�f���,|�H�Z(�%��a�^�(��k�-j63Mnͱ������9���nz�_JD��R�B=,��.����Jb�8��%��������< �u�+VEL�c�pY˸���j��4�q�%
�*vݕU��>p���ms��)������J"���սBޤ1_��`���3Hz�)�?ɵF      T   "  x��Wmo�6������a�"9���S�,oESu1dÀ��N2c�TIʩ��w�d;p�4�:`]ā�r��û�$eϜ6p�s�p�ǟ��r����m�F8>���Y#]c�]��Nhe#v�9C)Q9ȴʅ_������T\(G�G�� �B��{�A,�X�c����^rE���~)H\���0�$��8f�|Uyy���Z~jD��Q����X��J�.���<��쭞+�V���d�aw�Y���$�e��͝�����XD��%.�����hD���Rdh�9��ܜp��}/�6��.���m�iпy{s5�����rub�"�D��^�$����i5^%�"[45FW(ʄ���;��Q�}V���qH�=I
�*!ѲK��&G�������<ĝ���jCD�>�2��6zI���uA�)�LHA��R�T��Yd��f�^��%9Ȝa�lRJ&Z^�t,f�x0�ǣ� ���Q�%�h8���m�{c��ؔ\!��=Bkǌ�_Oص�LX0��t�	�N�2�kX"d�\̵������)b���9�Z���q�=�ֆ�v�|���w ��A֙&�6u�n�t %;b�$�S��?��d���&T��te��Œ}U�q���7Έ��ߞ�b�>��kM����)$��!uP2.d��}��m�_B���p�t@ f+ޛ�d�.�Y��>��lK��N��ze�기 �z�$|�8��)�җ0"I�{=�;ݙ�K*F�t4��TغXu���D��m_�8�����<z؟_O�lD`nW����C�L����G�����%;�݁����g��y�4�L|�M^�R�!�����N5�Z���|X"vL@|��^

-}��@*�>M��y�>ҿu��-	�!�[x%!&��<풔~x�.Jס=�4�%5�Ȁ$f��Τ���G�%O�����]r#tc�w	�]�g��x��p��ݗ��/Ԁ��P�mȖ4��qK������+f��	
/���� �����%���f��z�������E,L<      J   	  x�u�M��0��ï�r�(�e{*he�e�^�b��d��D�J+�{'!���/v��>z�!I�ys�h�8s��L��q/�a��v��u�%�W���WhK|vT)r�
�-,ɰ憎v��O�K�*���q�UQ�C0(Ӵ�����z�'q|�d�z���r�D���r��Ds��J�:`$��z����Y�p ˔������,_�/��i��)�&��� �-�:�6��ٵAw	5w��ZQ�t���
ē�9�zd��-�na|�;�k� �1�o�sީ�;��mV�]����E�jl^����٫s��"�lS+1r!�1P��ͳ}I��A���&�u��uZU+�6������A2��5g�K�f�&o�%���z�U[4�jJ��9Lō�h��Z���&A+*�"�+eP7�|�����V�����hj�-���|��2�U-����kz�cΏ��(�qU*	+/Ä8�[����L���$S�ySS�ÑB"��
���w[���\<�Dь���Y��{�N�/r�Q#      V   �  x���r�6���S�`0��4�n6�lv`��Eg��"[^I�e��G��I���%��/�-�G����}v���V�3�3�9o�a����x؃���3������j)Q%�ez���6Bfb� �-��S��� 췃�r�q��A����v���MG�4l#]G��g#s��h������w�\X��
����̠�	fn��6���,��:����Ο����՚}DL,8s�Dg�:��\[+�
���Aɭ�^��l8��8n��b�0z�J�3{C�Q84p�bC��[�j��[Z&��0GӀX.q�f�e������h;����!���?8�b�OR,c��+)I�c"��M�k���0+2��_��%`0�t�o�݊�AT���EQ��Y4��;�xN
#�V*U����E��抄��v"�+�\d�ե�),tf�)�v�l*���5��E�q <��1��I�eĳ�
~2+�e0�א��MI�]�6ֺ0$>ba���Չ	L�}b��[kE��������[\˅"��3����	�d�E��};�|���Tګ�F��	9k�Km$��Ku����v/H�T�5�I��t�� �O�������wCtz����������/��s��g(ew4W���7��Ѹ��,z�KlҔ���$*�R�$����z���vºr���A�nSa�~1�����d��#�NN"��H����(��P�Qkƒ,���ͫOP߱&��l@��o���$�*�Y��}�b�n�s�M$<�I�����l�	#�Xzv�	ٻT�T��VZV���0b�xW��
�5/�7� �ߨ�����+Mɱ����Ҿ��/�\l�ܻ������4�7G����K�������gM�%�;�;N�W���^,�.֔��`�	��`*�Q*���2��s�z����
���*L�h~Lyw��T��;xH|ƏX���$��K/�{��Ix>�Y�)?O~~�m%JS�>۩�4�1%E
��^i��M;����*CU�}Y��]wW��riZ�P.�O�I�z6�b(�������k�k/ ��E
E�|��ڵaȦ:_Ӂ��i���\�j.ga�:�<��8����R�'���9��<�f.b�>+���+KPXM��x�����OL��A楏�/������V��]��      L   �  x�Օ�r�6���S��C;#Q�$J�o�'ӉO�Nr�"W"J@�h�}�*i�d�iO>	��b����Y��G�ZlY��z�K�z3�n,���h�͆�n�o賄�E �����(w�N�0�O J�)�i�7�vR)��Ɠi>c�t<���8��x8�؂]��A�����{�޼�R�.�K�M̳���t���U��ܢ)�"�:�Σ�{(ʄ���宦4\r8>��W�[w;�:���O�}Bi�Y�dn$DY	|X�ѯ�ҫe#}�:m?�Q~5s�/w��ӗ�O����k�~@(��*�ųճ�o�}�>�?U��'���6�%��<�oXz5c٬���;��kG���T���^��q��["^p��\��\���5/B��(��Qw��g���Ӗ*��B>?V<�ΉOS^�]���zr��)��9�M���V{'��F��h�ׂ6��_���AN}��5I�rj�������|�y��h���4M�Y>I��vβy�v���d�� �X�3�z�1XJ-�0X��	�W-t�������$��~����s���A9���r�[��^6���+���"�J��[�E�|�Dۢ mS9O�.z�<,[���^���Jd�hv�� T�sQ���ѽѝl0�]�6�[��P�r5��{Q�NBw��5{~#�߉`ϑ�͹=�#�0%�ȵ�^��z�/��D*�2�G�?�_`K3"��R�MC9���+�at̺0M�j�vh�cG�]��G�7R�����~A߰솽?���B!�"�>�a�Q�T��#�)�P����|yB�ǇO: a��+�aKE�u��?��z�>��i���;!=������I:��u�ߕ~:�	r>�w@�C΄�3�[� ���y��9��\]]��,p      P   �   x�m���0D�3���+	dՒ�눗S��������bSL���	=���w�+0��\����ͭڬ���C��H��J]��n���LS��B-u�[(Rov�T(��_M�Ƚ0vͽ ���^tvͽ��/�é��Bs/��Bs/��Bs��j�}7�X      N   �  x�m��n�@�ϓ���Ж�ǥ��R\�'�v2�ɖp�5x=�O���J=%��?����7�Z� <���p��kt�����;�H�:��#d�}����8�Y�G�%j�4P�M'䧐'A���26������Np�KՄ�cQ-;�ʔ��f���urBy�'ʽ�\$��j,D�1Uw�~0����k�N���/�9f�`v����{� ������+Cz��_�(��Y�?Ҷ2QVѩkuo쭱�f�H�h���p���<�djI���H����͐�|c٫}��y)�Z{u����;/<|@I��U�ۗ�J\�w�ޕ+�,���)��!�s�{`�8�MJ��m���c�~޲���&�:=(�н�)�`X�䯭4���r��J��ޗ�~e�vn$ve��L~�����X�����@�kT�G�P&�e�Q���b����4b!�߅H+]�[<>�{tA�r5���������8       R   5   x�3��44�4202�50�52T00�24�20�37065��4���"�=... ��P      H   s  x����N�0��w)[���%F@#j�D.L�B�X]ig[�׷+D}�qמ4m���O)��l6#IF�	��DXDU
��D��
��F�u'����]+�?HǓi�A�\co�X�#qbG��	o�h�ޠi�m����c���QW�؜������h��kLv��u6�l��_��'���Y���Ab���W�K!�a�,��}���Wտ�	Ь�MI��@��w�J�;4���Nk�Ba�I�Er�;�f��_��荗�s�L�8=�v.��cλ΅9TAv��a���6���\��/��OmB(%~wI�r�Bxb5��s9��7�=������ �j��A�[��r/���!�g��6h]��-��g�6�n2����~��(��:k�      D   �   x�u��
�0�ϓ��SP�J�<y��`R�I1����E����|3z�.�$�nÄ�062!�>��A�Bg��mv&���8��%@�<ۨ��_�5�P��g�زrw͏ˬ�̍{���Tl-����r%NJ��P�     