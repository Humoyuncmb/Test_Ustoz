export const C = {
  primary : '#4F46E5',
  pl      : '#6366F1',
  pd      : '#3730A3',
  success : '#10B981',
  warn    : '#F59E0B',
  danger  : '#EF4444',
  bg      : '#F0F4FF',
  white   : '#FFFFFF',
  text    : '#0F172A',
  sub     : '#64748B',
  border  : '#E2E8F0',
};

export const GLOBAL_CSS = `
  @keyframes bounce  { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-9px)} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes popIn   { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
  html,body,#root { height:100%; margin:0; padding:0; background:#E8EAF6; }
  * { -webkit-tap-highlight-color:transparent; box-sizing:border-box; }
  input,textarea,button { font-family:inherit; }
  ::-webkit-scrollbar { display:none; }
  button:active { transform:scale(0.97); }
`;
