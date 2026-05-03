/**
 * 主初始化脚本
 * 初始化所有页面功能和动画
 */

// 导入音频控制模块
async function initAudioControlModule() {
  try {
    const module = await import('./audio-control.js');
    return module.initAudioControl();
  } catch (e) {
    console.warn('无法加载音频控制模块:', e);
  }
}

/**
 * 初始化 AOS (Animate On Scroll)
 */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      offset: 100,
      once: true,
      easing: 'ease-out-quad'
    });
  } else {
    console.warn('AOS library not found');
  }
}

/**
 * 初始化首屏 Parallax 效果
 */
function initParallax() {
  const heroTitle = document.querySelector('.video-caption--head .video-headline');
  const heroSummary = document.querySelector('.video-caption--head .video-summary');

  if (!heroTitle && !heroSummary) return;

  // 检查用户是否禁用了动画
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // 标记元素以优化性能
  if (heroTitle) heroTitle.style.willChange = 'transform';
  if (heroSummary) heroSummary.style.willChange = 'transform';

  let ticking = false;

  function render() {
    const y = window.pageYOffset || document.documentElement.scrollTop || 0;
    const titleOffset = Math.max(-120, Math.min(120, -y * 0.12));
    const summaryOffset = Math.max(-90, Math.min(90, -y * 0.08));

    if (heroTitle) {
      heroTitle.style.transform = `translate3d(0, ${titleOffset.toFixed(2)}px, 0)`;
    }
    if (heroSummary) {
      heroSummary.style.transform = `translate3d(0, ${summaryOffset.toFixed(2)}px, 0)`;
    }

    ticking = false;
  }

  function requestRender() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(render);
    }
  }

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender);

  // 初始化
  requestRender();
}

/**
 * 初始化导航栏部分链接
 */
function initNavigation() {
  const navSections = document.querySelector('.navigation-sections');
  if (!navSections) return;

  navSections.addEventListener('click', (e) => {
    const link = e.target.closest('.navigation-section');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const target = document.getElementById(href.substring(1));
    if (!target) return;

    e.preventDefault();

    document.querySelectorAll('.navigation-section').forEach(s => s.classList.remove('navigation-section--active'));
    link.classList.add('navigation-section--active');

    const navHeight = document.querySelector('.navigation')?.offsetHeight || 60;
    const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

/**
 * 初始化图表
 */
function initCharts() {
  // Chart.js 已经由HTML中的脚本自动初始化
  // 这里只是作为占位符，如有需要可以扩展
  if (typeof Chart !== 'undefined') {
    // 图表相关的自定义逻辑可以在这里添加
  }
}

/**
 * 初始化视频元素
 */
function initVideos() {
  const videos = document.querySelectorAll('video');

  videos.forEach(video => {
    // 确保视频设置了正确的属性
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
  });
}

/**
 * 初始化响应式菜单
 */
function initResponsiveMenu() {
  // 如果存在移动菜单，可以在这里添加逻辑
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
}

/**
 * 监听页面可见性变化（视频播放优化）
 */
function initVisibilityHandler() {
  const videos = document.querySelectorAll('video');

  document.addEventListener('visibilitychange', () => {
    videos.forEach(video => {
      if (document.hidden) {
        // 页面隐藏时暂停视频
        video.pause();
      } else {
        // 页面显示时可以恢复（但不自动播放）
        // 由 AOS 和其他逻辑控制
      }
    });
  });
}

/**
 * 主初始化函数
 */
async function init() {
  console.log('初始化页面...');

  // 初始化各个模块
  initAOS();
  initParallax();
  initNavigation();
  initCharts();
  initVideos();
  initResponsiveMenu();
  initVisibilityHandler();

  // 初始化音频控制
  await initAudioControlModule();

  // 标记页面已加载
  document.body.classList.add('page-loaded');

  console.log('页面初始化完成');
}

/**
 * 等待DOM加载完成后初始化
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM已经加载
  init();
}

// 导出函数以供调试
window.pageUtils = {
  initAOS,
  initParallax,
  initNavigation,
  initCharts
};
