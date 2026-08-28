(()=>{
  const AUDIO_FILE='romansenykmusic-cinematic-ambient-corporate-inspiring-emotional-125960.mp3';
  const STATE_KEY='stphMusicEnabled';
  const TIME_KEY='stphMusicTime';
  const VOLUME=0.12;

  const style=document.createElement('style');
  style.textContent=`
    .stph-music-toggle{position:fixed;right:18px;bottom:18px;z-index:9999;border:1px solid #b89553;background:#0b1510e8;color:#f4efe4;padding:10px 13px;font:600 .62rem Arial,sans-serif;text-transform:uppercase;letter-spacing:.12em;box-shadow:0 5px 18px #0006;cursor:pointer;backdrop-filter:blur(4px)}
    .stph-music-toggle:hover{background:#17261d;color:#d4b66f}.stph-music-toggle.playing{color:#d4b66f}
    @media(max-width:520px){.stph-music-toggle{right:12px;bottom:12px;padding:9px 11px;font-size:.58rem}}
  `;
  document.head.appendChild(style);

  const audio=document.createElement('audio');
  audio.src=AUDIO_FILE;
  audio.loop=true;
  audio.preload='auto';
  audio.volume=VOLUME;
  audio.setAttribute('aria-hidden','true');
  document.body.appendChild(audio);

  const button=document.createElement('button');
  button.type='button';
  button.className='stph-music-toggle';
  button.setAttribute('aria-label','Toggle background music');
  document.body.appendChild(button);

  const stored=localStorage.getItem(STATE_KEY);
  let enabled=stored===null ? true : stored==='on';
  const savedTime=parseFloat(localStorage.getItem(TIME_KEY)||'0');

  const updateButton=()=>{
    const playing=!audio.paused;
    button.textContent=playing?'♪ Music On':'♪ Music Off';
    button.classList.toggle('playing',playing);
    button.setAttribute('aria-pressed',playing?'true':'false');
  };

  audio.addEventListener('loadedmetadata',()=>{
    if(Number.isFinite(savedTime)&&savedTime>0&&audio.duration){
      audio.currentTime=savedTime%audio.duration;
    }
  },{once:true});

  const saveTime=()=>{
    if(Number.isFinite(audio.currentTime)) localStorage.setItem(TIME_KEY,String(audio.currentTime));
  };
  setInterval(saveTime,1000);
  window.addEventListener('pagehide',saveTime);

  const start=()=>{
    if(!enabled) return;
    audio.play().then(updateButton).catch(()=>updateButton());
  };

  button.addEventListener('click',()=>{
    if(audio.paused){
      enabled=true;
      localStorage.setItem(STATE_KEY,'on');
      audio.play().then(updateButton).catch(updateButton);
    }else{
      enabled=false;
      localStorage.setItem(STATE_KEY,'off');
      audio.pause();
      updateButton();
    }
  });

  audio.addEventListener('play',updateButton);
  audio.addEventListener('pause',updateButton);
  updateButton();

  if(enabled){
    start();
    const unlock=()=>{start();document.removeEventListener('pointerdown',unlock,true);document.removeEventListener('keydown',unlock,true)};
    document.addEventListener('pointerdown',unlock,true);
    document.addEventListener('keydown',unlock,true);
  }
})();