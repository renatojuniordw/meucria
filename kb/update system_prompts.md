update system_prompts
set content = $$

$$
,
    version = 2,
    updated_at = now()
where id = 'copy';


/*
IDs

[
  {
    "id": "generate"
  },
  {
    "id": "clone"
  },
  {
    "id": "suggest_colors"
  },
  {
    "id": "suggest_content"
  },
  {
    "id": "copy"
  }
]
 */


$$
