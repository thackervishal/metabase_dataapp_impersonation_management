-- Lets the Metabase connection role (metabase_reader) impersonate each person
-- via SET ROLE. INHERIT FALSE = it can switch to them but does not silently
-- gain their privileges itself. Real deployments need this grant for every
-- person role the impersonating connection user should be able to become
-- (the v2 "create person" trigger should do it automatically).

grant imp_pr_rl_bruce, imp_pr_rl_frodo, imp_pr_rl_carol, imp_pr_rl_thor, imp_pr_rl_erin, imp_pr_rl_frank
  to metabase_reader with inherit false, set true;
