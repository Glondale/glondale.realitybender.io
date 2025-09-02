// Minimal Email app: loads a single JSON email
(function(global){
  function EmailApp(){ this.id='email'; this.name='Email'; }
  EmailApp.prototype.open = async function(){
    try{
      const res = await fetch('data/emails/inbox/0001-welcome.json');
      if(!res.ok) throw new Error('No emails');
      const mail = await res.json();
      const html = `<div><strong>From:</strong> ${mail.from}<br/><strong>Subject:</strong> ${mail.subject}<hr/><div style="white-space:pre-wrap">${escapeHtml(mail.body)}</div></div>`;
      WindowManager.createWindow('Email - '+mail.subject, html, {width:520,height:360,x:100,y:100});
    }catch(e){
      WindowManager.createWindow('Email', '<div class="content">No mail found</div>');
    }
  };
  function escapeHtml(s){ return (s||'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]); }
  if(window.PluginManager) window.PluginManager.register('email', ()=> new EmailApp());
  global.EmailApp = EmailApp;
})(window);
