-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

SET check_function_bodies = false;

DROP EXTENSION pg_net;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO service_role;

CREATE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $function$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$function$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;

GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;

GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;

CREATE FUNCTION public.rls_auto_enable()
  RETURNS event_trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'pg_catalog'
  AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

GRANT ALL ON FUNCTION public.rls_auto_enable() TO anon;

GRANT ALL ON FUNCTION public.rls_auto_enable() TO authenticated;

GRANT ALL ON FUNCTION public.rls_auto_enable() TO service_role;

CREATE TABLE public.events (
  id              uuid                     DEFAULT extensions.uuid_generate_v4() NOT NULL,
  name            text                     NOT NULL,
  date            date                     NOT NULL,
  end_date        date,
  city            text                     NOT NULL,
  state           text                     NOT NULL,
  state_code      character(2)             NOT NULL,
  arena           text                     NOT NULL,
  arena_address   text,
  added_money     integer                  DEFAULT 0,
  entry_fee       integer                  NOT NULL,
  classes         text[]                   DEFAULT '{}'::text[],
  flyer_image_url text,
  facebook_url    text,
  website_url     text,
  contact_name    text,
  contact_email   text,
  contact_phone   text,
  notes           text,
  is_featured     boolean                  DEFAULT false,
  is_approved     boolean                  DEFAULT false,
  submitted_by    uuid,
  lat             numeric,
  lng             numeric,
  created_at      timestamp with time zone DEFAULT now(),
  "flyer-url"     text
);

ALTER TABLE public.events
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.events
  ADD CONSTRAINT events_pkey PRIMARY KEY (id);

GRANT ALL ON public.events TO anon;

GRANT ALL ON public.events TO authenticated;

GRANT ALL ON public.events TO service_role;

CREATE POLICY "Approved events are viewable by everyone" ON public.events
  FOR SELECT
  USING ((is_approved = true));

CREATE POLICY "Authenticated users can submit events" ON public.events
  FOR INSERT
  WITH CHECK ((auth.uid() IS NOT NULL));

CREATE POLICY "Users can update their own submitted events" ON public.events
  FOR UPDATE
  USING ((submitted_by = auth.uid()));

CREATE POLICY "Users can view their own submitted events" ON public.events
  FOR SELECT
  TO authenticated
  USING ((submitted_by = ( SELECT auth.uid() AS uid)));

CREATE TABLE public.favorites (
  id         uuid                     DEFAULT extensions.uuid_generate_v4() NOT NULL,
  user_id    uuid                     NOT NULL,
  event_id   uuid                     NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.favorites
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.favorites
  ADD CONSTRAINT favorites_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.favorites
  ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);

ALTER TABLE public.favorites
  ADD CONSTRAINT favorites_user_id_event_id_key UNIQUE (user_id, event_id);

GRANT ALL ON public.favorites TO anon;

GRANT ALL ON public.favorites TO authenticated;

GRANT ALL ON public.favorites TO service_role;

CREATE POLICY "Users can add favorites" ON public.favorites
  FOR INSERT
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users can remove their own favorites" ON public.favorites
  FOR DELETE
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT
  USING ((auth.uid() = user_id));

CREATE TABLE public.profiles (
  id           uuid                     NOT NULL,
  email        text,
  display_name text,
  home_state   text,
  is_admin     boolean                  DEFAULT false,
  created_at   timestamp with time zone DEFAULT now()
);

CREATE POLICY "Admins can delete events" ON public.events
  FOR DELETE
  TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));

CREATE POLICY "Admins can update any event" ON public.events
  FOR UPDATE
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));

CREATE POLICY "Admins can view all events" ON public.events
  FOR SELECT
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));

ALTER TABLE public.profiles
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

ALTER TABLE public.events
  ADD CONSTRAINT events_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.favorites
  ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

GRANT ALL ON public.profiles TO anon;

GRANT ALL ON public.profiles TO authenticated;

GRANT ALL ON public.profiles TO service_role;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  USING ((auth.uid() = id));

CREATE EVENT TRIGGER ensure_rls
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION public.rls_auto_enable();
