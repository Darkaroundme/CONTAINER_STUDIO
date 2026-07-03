/*
# Create Flow-Based Code Generator Tables

1. New Tables
- `projects`: Stores saved visual flow projects
  - `id` (uuid, primary key)
  - `name` (text, not null) - project name
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  
- `nodes`: Stores individual code blocks/nodes in a project
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key to projects)
  - `type` (text, not null) - block type (variable, loop, function, etc.)
  - `position_x` (float, not null) - x position on canvas
  - `position_y` (float, not null) - y position on canvas
  - `properties` (jsonb) - editable block properties
  - `created_at` (timestamp)
  
- `edges`: Stores connections between nodes
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key to projects)
  - `source_node` (uuid, foreign key to nodes)
  - `target_node` (uuid, foreign key to nodes)
  - `source_handle` (text) - output handle name
  - `target_handle` (text) - input handle name
  - `created_at` (timestamp)

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated CRUD (single-tenant, no auth required).

3. Indexes
- Index on project_id for nodes and edges for efficient queries.
- Index on source_node and target_node for edge traversal.
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL,
  position_x float NOT NULL DEFAULT 0,
  position_y float NOT NULL DEFAULT 0,
  properties jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source_node uuid NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  target_node uuid NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  source_handle text,
  target_handle text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_nodes_project_id ON nodes(project_id);
CREATE INDEX IF NOT EXISTS idx_edges_project_id ON edges(project_id);
CREATE INDEX IF NOT EXISTS idx_edges_source_node ON edges(source_node);
CREATE INDEX IF NOT EXISTS idx_edges_target_node ON edges(target_node);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE edges ENABLE ROW LEVEL SECURITY;

-- Projects policies (anon + authenticated for single-tenant)
DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);

-- Nodes policies
DROP POLICY IF EXISTS "anon_select_nodes" ON nodes;
CREATE POLICY "anon_select_nodes" ON nodes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_nodes" ON nodes;
CREATE POLICY "anon_insert_nodes" ON nodes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_nodes" ON nodes;
CREATE POLICY "anon_update_nodes" ON nodes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_nodes" ON nodes;
CREATE POLICY "anon_delete_nodes" ON nodes FOR DELETE
  TO anon, authenticated USING (true);

-- Edges policies
DROP POLICY IF EXISTS "anon_select_edges" ON edges;
CREATE POLICY "anon_select_edges" ON edges FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_edges" ON edges;
CREATE POLICY "anon_insert_edges" ON edges FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_edges" ON edges;
CREATE POLICY "anon_update_edges" ON edges FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_edges" ON edges;
CREATE POLICY "anon_delete_edges" ON edges FOR DELETE
  TO anon, authenticated USING (true);
