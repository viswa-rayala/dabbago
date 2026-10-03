// ==========================================================================
// DabbaGo - Lunch Box Delivery App Logic
// Supports live simulation, recipient switching (School vs Office), modals & tabs
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // State store
  const state = {
    currentRecipient: 'aarav', // 'aarav' (School) or 'vikram' (Office)
    currentStage: 'transit', // 'scheduled', 'transit', 'delivered'
    activeTab: 'tabHome',
    skippedDays: new Set(),
    currentUser: JSON.parse(localStorage.getItem('dabbago_user')) || {
      name: 'Priya Sharma',
      phone: '9845028190',
      area: 'Indiranagar',
      deliveryFor: 'school'
    },
    activeOtp: '4829',
    otpCountdownTimer: null,
    pendingAuthData: null,
    profiles: {
      aarav: {
        name: 'Aarav',
        role: 'School Student',
        destination: 'Green Valley School, Junior Wing',
        destShort: 'Green Valley School',
        class: 'Grade 4-B',
        orderSubtitle: "Today's lunch for Aarav",
        statusHeadline: 'On the way',
        etaText: 'ETA 12:10',
        pickupTime: '11:20',
        dropTime: '12:10',
        riderName: 'Rahul',
        riderInitials: 'R',
        riderRating: '⭐ 4.95 • 1,420+ Deliveries',
        riderVehicle: 'Electric Scooter (KA-03-EB-4921)',
        riderPass: 'Green Valley School ID: Active',
        dabbaTag: '#GV-402',
        pin: '5 8 2 1',
        bellTime: '12:20 PM'
      },
      vikram: {
        name: 'Vikram',
        role: 'Working Professional',
        destination: 'Mindspace Cyber Towers, Bldg 12, Fl 5',
        destShort: 'Mindspace Cyber Towers',
        class: 'Tech Mahindra',
        orderSubtitle: "Today's lunch for Vikram",
        statusHeadline: 'On the way',
        etaText: 'ETA 12:45',
        pickupTime: '11:45',
        dropTime: '12:45',
        riderName: 'Suresh Patel',
        riderInitials: 'SP',
        riderRating: '⭐ 4.98 • 2,100+ Deliveries',
        riderVehicle: 'Ather 450X (KA-01-MJ-8821)',
        riderPass: 'Tech Park Express Badge: Active',
        dabbaTag: '#TC-108',
        pin: '9 1 4 2',
        bellTime: '1:00 PM'
      }
    }
  };

  // DOM Elements
  const el = {
    // Top recipient switch
    btnSwitchAarav: document.getElementById('btnSwitchAarav'),
    btnSwitchVikram: document.getElementById('btnSwitchVikram'),
    
    // View mode switch
    btnDeviceMobile: document.getElementById('btnDeviceMobile'),
    btnDeviceWide: document.getElementById('btnDeviceWide'),
    deviceContainer: document.getElementById('deviceContainer'),

    // Active Card Elements
    orderForText: document.getElementById('orderForText'),
    etaText: document.getElementById('etaText'),
    statusTitle: document.getElementById('statusTitle'),
    seg1: document.getElementById('seg1'),
    seg2: document.getElementById('seg2'),
    seg3: document.getElementById('seg3'),
    stepLabel1: document.getElementById('stepLabel1'),
    stepLabel2: document.getElementById('stepLabel2'),
    stepLabel3: document.getElementById('stepLabel3'),
    riderName: document.getElementById('riderName'),
    riderAvatar: document.getElementById('riderAvatar'),
    riderSubtext: document.getElementById('riderSubtext'),
    btnCallRider: document.getElementById('btnCallRider'),
    btnOpenLiveMap: document.getElementById('btnOpenLiveMap'),
    activeOrderCard: document.getElementById('activeOrderCard'),

    // Upcoming elements
    upcomingSubtext1: document.getElementById('upcomingSubtext1'),
    upcomingSubtext2: document.getElementById('upcomingSubtext2'),
    btnSkipTue: document.getElementById('btnSkipTue'),
    btnSkipWed: document.getElementById('btnSkipWed'),
    btnSeeAllUpcoming: document.getElementById('btnSeeAllUpcoming'),
    btnRenewPlan: document.getElementById('btnRenewPlan'),

    // Modals
    liveMapModal: document.getElementById('liveMapModal'),
    btnCloseLiveMap: document.getElementById('btnCloseLiveMap'),
    liveTrackingTitle: document.getElementById('liveTrackingTitle'),
    btnCallFromMap: document.getElementById('btnCallFromMap'),
    btnNotifySchool: document.getElementById('btnNotifySchool'),

    callRiderModal: document.getElementById('callRiderModal'),
    btnCloseCallModal: document.getElementById('btnCloseCallModal'),
    btnMakePhoneCall: document.getElementById('btnMakePhoneCall'),
    btnWhatsAppMessage: document.getElementById('btnWhatsAppMessage'),

    skipDayModal: document.getElementById('skipDayModal'),
    btnCloseSkipModal: document.getElementById('btnCloseSkipModal'),
    btnCancelSkip: document.getElementById('btnCancelSkip'),
    btnConfirmSkip: document.getElementById('btnConfirmSkip'),
    skipModalDayText: document.getElementById('skipModalDayText'),
    skipModalSubtext: document.getElementById('skipModalSubtext'),

    // PWA Elements
    pwaInstallBanner: document.getElementById('pwaInstallBanner'),
    btnPwaInstall: document.getElementById('btnPwaInstall'),
    btnPwaDismiss: document.getElementById('btnPwaDismiss'),
    btnTopInstall: document.getElementById('btnTopInstall'),
    pwaGuideModal: document.getElementById('pwaGuideModal'),
    btnClosePwaGuide: document.getElementById('btnClosePwaGuide'),
    btnTriggerNativeInstall: document.getElementById('btnTriggerNativeInstall'),

    renewModal: document.getElementById('renewModal'),
    btnCloseRenewModal: document.getElementById('btnCloseRenewModal'),
    btnSubmitRenewal: document.getElementById('btnSubmitRenewal'),

    // Simulators
    btnSimScheduled: document.getElementById('btnSimScheduled'),
    btnSimTransit: document.getElementById('btnSimTransit'),
    btnSimDelivered: document.getElementById('btnSimDelivered'),

    // Toast
    toastContainer: document.getElementById('toastContainer'),

    // Nav Items
    navItems: document.querySelectorAll('.bottom-nav .nav-item'),
    tabPages: document.querySelectorAll('.tab-page'),

    // Header Action
    btnNotification: document.getElementById('btnNotification'),

    // Profile actions
    btnManageAddresses: document.getElementById('btnManageAddresses'),
    btnDabbaTags: document.getElementById('btnDabbaTags'),
    btnEmergencyContacts: document.getElementById('btnEmergencyContacts'),
    btnPreferences: document.getElementById('btnPreferences'),

    // Plans page actions
    btnPauseCalendar: document.getElementById('btnPauseCalendar'),
    btnUpgradePlan: document.getElementById('btnUpgradePlan'),
    btnAddOfficePlan: document.getElementById('btnAddOfficePlan'),

    // Auth DOM Elements
    authView: document.getElementById('authView'),
    btnOpenAuthModal: document.getElementById('btnOpenAuthModal'),
    topAuthBtnLabel: document.getElementById('topAuthBtnLabel'),
    btnAuthClose: document.getElementById('btnAuthClose'),
    btnAuthBack: document.getElementById('btnAuthBack'),
    paneLogin: document.getElementById('paneLogin'),
    paneSignup: document.getElementById('paneSignup'),
    tabSwitchLogin: document.getElementById('tabSwitchLogin'),
    tabSwitchSignup: document.getElementById('tabSwitchSignup'),
    formLogin: document.getElementById('formLogin'),
    loginPhone: document.getElementById('loginPhone'),
    btnSubmitLogin: document.getElementById('btnSubmitLogin'),
    btnGotoSignup: document.getElementById('btnGotoSignup'),
    btnDemoAutofillLogin: document.getElementById('btnDemoAutofillLogin'),
    btnResendLoginOtp: document.getElementById('btnResendLoginOtp'),
    loginTimerStatus: document.getElementById('loginTimerStatus'),
    loginTimerMsg: document.getElementById('loginTimerMsg'),
    loginTimerSec: document.getElementById('loginTimerSec'),
    loginTimerPill: document.getElementById('loginTimerPill'),
    loginOtpInputs: document.querySelectorAll('.login-otp'),
    formSignup: document.getElementById('formSignup'),
    signupName: document.getElementById('signupName'),
    signupPhone: document.getElementById('signupPhone'),
    signupArea: document.getElementById('signupArea'),
    btnSubmitSignup: document.getElementById('btnSubmitSignup'),
    btnGotoLogin: document.getElementById('btnGotoLogin'),
    btnDemoAutofillSignup: document.getElementById('btnDemoAutofillSignup'),
    btnResendSignupOtp: document.getElementById('btnResendSignupOtp'),
    signupTimerStatus: document.getElementById('signupTimerStatus'),
    signupTimerMsg: document.getElementById('signupTimerMsg'),
    signupTimerSec: document.getElementById('signupTimerSec'),
    signupTimerPill: document.getElementById('signupTimerPill'),
    signupOtpInputs: document.querySelectorAll('.signup-otp'),
    rolePillOptions: document.querySelectorAll('.role-pill-option'),
    greetingTitle: document.querySelector('.greeting-title'),
    profileUserName: document.getElementById('profileUserName'),
    profileUserPhone: document.getElementById('profileUserPhone'),
    profileUserArea: document.getElementById('profileUserArea'),
    profileUserAvatar: document.getElementById('profileUserAvatar'),
    profileAddressSub: document.getElementById('profileAddressSub'),
    btnLogoutUser: document.getElementById('btnLogoutUser'),

    statusClock: document.getElementById('statusClock')
  };

  // Clock Update
  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    if (el.statusClock) {
      el.statusClock.textContent = `${hours}:${minutes}`;
    }
  }
  updateClock();
  setInterval(updateClock, 30000);

  // Render current recipient & order status
  function renderView() {
    const p = state.profiles[state.currentRecipient];

    // Subtitle & Texts
    el.orderForText.textContent = p.orderSubtitle;
    el.riderName.textContent = p.riderName;
    el.riderAvatar.textContent = p.riderInitials;
    el.upcomingSubtext1.textContent = `Pickup 11:15 AM, ${p.destShort}`;
    el.upcomingSubtext2.textContent = `Pickup 11:15 AM, ${p.destShort}`;

    // Update Stage visualization
    if (state.currentStage === 'scheduled') {
      el.statusTitle.textContent = 'Pickup Scheduled';
      el.etaText.textContent = `Pickup ${p.pickupTime}`;
      el.stepLabel1.textContent = `Pickup ${p.pickupTime}`;
      el.stepLabel1.className = 'step-label active current';
      el.stepLabel2.className = 'step-label muted';
      el.stepLabel3.className = 'step-label muted';
      el.seg1.className = 'progress-bar-segment completed';
      el.seg2.className = 'progress-bar-segment upcoming';
      el.seg3.className = 'progress-bar-segment upcoming';
      el.riderSubtext.textContent = 'Rider arriving at home in 15 mins';
    } else if (state.currentStage === 'transit') {
      el.statusTitle.textContent = 'On the way';
      el.etaText.textContent = p.etaText;
      el.stepLabel1.textContent = `Picked up ${p.pickupTime}`;
      el.stepLabel1.className = 'step-label active';
      el.stepLabel2.className = 'step-label active current';
      el.stepLabel3.className = 'step-label muted';
      el.seg1.className = 'progress-bar-segment completed';
      el.seg2.className = 'progress-bar-segment completed';
      el.seg3.className = 'progress-bar-segment upcoming';
      el.riderSubtext.textContent = 'Your rider, ID verified';
    } else if (state.currentStage === 'delivered') {
      el.statusTitle.textContent = 'Delivered';
      el.etaText.textContent = `Delivered ${p.dropTime}`;
      el.stepLabel1.textContent = `Picked up ${p.pickupTime}`;
      el.stepLabel1.className = 'step-label active';
      el.stepLabel2.className = 'step-label active';
      el.stepLabel3.className = 'step-label active current';
      el.seg1.className = 'progress-bar-segment completed';
      el.seg2.className = 'progress-bar-segment completed';
      el.seg3.className = 'progress-bar-segment completed';
      el.riderSubtext.textContent = `Handed over at ${p.destShort}`;
    }

    // Modal details update
    if (el.liveTrackingTitle) {
      el.liveTrackingTitle.textContent = `${p.name}'s Lunch Tracker`;
    }
    const callAvatar = document.querySelector('.rider-call-avatar');
    const callName = document.querySelector('.rider-call-name');
    if (callAvatar) callAvatar.textContent = p.riderInitials;
    if (callName) callName.textContent = p.riderName;

    // Dynamic User Profile & Greeting
    if (state.currentUser) {
      const firstName = state.currentUser.name ? state.currentUser.name.split(' ')[0] : 'Priya';
      if (el.greetingTitle) el.greetingTitle.textContent = `Hi, ${firstName}`;
      if (el.profileUserName) el.profileUserName.textContent = state.currentUser.name;
      if (el.profileUserPhone) el.profileUserPhone.textContent = `+91 ${state.currentUser.phone}`;
      if (el.profileUserArea) el.profileUserArea.textContent = `${state.currentUser.area || 'Indiranagar'}`;
      if (el.profileAddressSub) el.profileAddressSub.textContent = `Home: Flat 402, Lotus Greens, ${state.currentUser.area || 'Indiranagar'}`;
      if (el.profileUserAvatar) el.profileUserAvatar.textContent = firstName.charAt(0).toUpperCase();
      if (el.topAuthBtnLabel) el.topAuthBtnLabel.textContent = `Hi, ${firstName}`;
    } else {
      if (el.greetingTitle) el.greetingTitle.textContent = `Hi, Guest`;
      if (el.topAuthBtnLabel) el.topAuthBtnLabel.textContent = `Sign In / Register`;
    }
  }

  // Recipient Switcher Event Handlers
  el.btnSwitchAarav.addEventListener('click', () => {
    state.currentRecipient = 'aarav';
    el.btnSwitchAarav.classList.add('active');
    el.btnSwitchVikram.classList.remove('active');
    renderView();
    showToast("Switched to Aarav's School Lunch Schedule 🎒");
  });

  el.btnSwitchVikram.addEventListener('click', () => {
    state.currentRecipient = 'vikram';
    el.btnSwitchVikram.classList.add('active');
    el.btnSwitchAarav.classList.remove('active');
    renderView();
    showToast("Switched to Vikram's Office Lunch Schedule 💼");
  });

  // Device Toggle
  el.btnDeviceMobile.addEventListener('click', () => {
    el.deviceContainer.classList.remove('expanded-mode');
    el.btnDeviceMobile.classList.add('active');
    el.btnDeviceWide.classList.remove('active');
  });

  el.btnDeviceWide.addEventListener('click', () => {
    el.deviceContainer.classList.add('expanded-mode');
    el.btnDeviceWide.classList.add('active');
    el.btnDeviceMobile.classList.remove('active');
  });

  // Simulator Stage Buttons
  el.btnSimScheduled.addEventListener('click', () => {
    state.currentStage = 'scheduled';
    updateSimButtons(el.btnSimScheduled);
    renderView();
    showToast("Simulating Stage 1: Pickup Scheduled at Home");
  });

  el.btnSimTransit.addEventListener('click', () => {
    state.currentStage = 'transit';
    updateSimButtons(el.btnSimTransit);
    renderView();
    showToast("Simulating Stage 2: Lunch Box In Transit");
  });

  el.btnSimDelivered.addEventListener('click', () => {
    state.currentStage = 'delivered';
    updateSimButtons(el.btnSimDelivered);
    renderView();
    showToast("Simulating Stage 3: Successfully Delivered to Destination");
  });

  function updateSimButtons(activeBtn) {
    [el.btnSimScheduled, el.btnSimTransit, el.btnSimDelivered].forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  // Modals Open / Close Helper
  function openModal(modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Live Map Modal
  el.btnOpenLiveMap.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(el.liveMapModal);
  });
  el.activeOrderCard.addEventListener('click', (e) => {
    // Only open if not clicking the call button
    if (!e.target.closest('#btnCallRider')) {
      openModal(el.liveMapModal);
    }
  });
  el.btnCloseLiveMap.addEventListener('click', () => closeModal(el.liveMapModal));
  el.liveMapModal.addEventListener('click', (e) => {
    if (e.target === el.liveMapModal) closeModal(el.liveMapModal);
  });

  // Call Rider Modal
  el.btnCallRider.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(el.callRiderModal);
  });
  el.btnCallFromMap.addEventListener('click', () => {
    closeModal(el.liveMapModal);
    openModal(el.callRiderModal);
  });
  el.btnCloseCallModal.addEventListener('click', () => closeModal(el.callRiderModal));
  el.callRiderModal.addEventListener('click', (e) => {
    if (e.target === el.callRiderModal) closeModal(el.callRiderModal);
  });

  el.btnMakePhoneCall.addEventListener('click', (e) => {
    e.preventDefault();
    showToast(`Calling ${state.profiles[state.currentRecipient].riderName}... 📞`);
    setTimeout(() => {
      closeModal(el.callRiderModal);
    }, 1200);
  });

  el.btnWhatsAppMessage.addEventListener('click', () => {
    showToast("Opening WhatsApp with quick delivery instructions... 💬");
    closeModal(el.callRiderModal);
  });

  el.btnNotifySchool.addEventListener('click', () => {
    showToast("Gate pass & PIN 5821 sent to School Security Desk ✓");
  });

  // Skip Day Flow
  let dayToSkip = null;
  let targetSkipBtn = null;

  function handleSkipClick(btn) {
    dayToSkip = btn.getAttribute('data-day');
    const school = btn.getAttribute('data-school');
    targetSkipBtn = btn;

    if (state.skippedDays.has(dayToSkip)) {
      // Already skipped, ask to resume
      state.skippedDays.delete(dayToSkip);
      btn.textContent = 'Skip';
      btn.classList.remove('is-skipped');
      showToast(`Delivery for ${dayToSkip} resumed! Tiffin will be picked up at 11:15 AM.`);
      return;
    }

    el.skipModalDayText.textContent = dayToSkip;
    el.skipModalSubtext.textContent = `${state.profiles[state.currentRecipient].destShort} Delivery`;
    openModal(el.skipDayModal);
  }

  el.btnSkipTue.addEventListener('click', () => handleSkipClick(el.btnSkipTue));
  el.btnSkipWed.addEventListener('click', () => handleSkipClick(el.btnSkipWed));

  el.btnConfirmSkip.addEventListener('click', () => {
    if (dayToSkip && targetSkipBtn) {
      state.skippedDays.add(dayToSkip);
      targetSkipBtn.textContent = 'Skipped';
      targetSkipBtn.classList.add('is-skipped');
      closeModal(el.skipDayModal);
      showToast(`Skipped ${dayToSkip}! ₹115 credited to your subscription balance.`);
    }
  });

  el.btnCancelSkip.addEventListener('click', () => closeModal(el.skipDayModal));
  el.btnCloseSkipModal.addEventListener('click', () => closeModal(el.skipDayModal));
  el.skipDayModal.addEventListener('click', (e) => {
    if (e.target === el.skipDayModal) closeModal(el.skipDayModal);
  });

  // Plan Renewal Flow
  el.btnRenewPlan.addEventListener('click', () => {
    openModal(el.renewModal);
  });

  el.btnCloseRenewModal.addEventListener('click', () => closeModal(el.renewModal));
  el.renewModal.addEventListener('click', (e) => {
    if (e.target === el.renewModal) closeModal(el.renewModal);
  });

  // Renewal tier selection
  const tierCards = document.querySelectorAll('.renewal-tiers .tier-card');
  tierCards.forEach(card => {
    card.addEventListener('click', () => {
      tierCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input');
      radio.checked = true;
      if (radio.value === '1month') {
        el.btnSubmitRenewal.textContent = 'Pay & Extend Pass (₹2,499)';
      } else {
        el.btnSubmitRenewal.textContent = 'Pay & Extend Pass (₹6,399)';
      }
    });
  });

  el.btnSubmitRenewal.addEventListener('click', () => {
    closeModal(el.renewModal);
    showToast("🎉 Pass Renewed Successfully! Next renewal in 36 days.");
    const planBannerTitle = document.querySelector('.plan-renew-title');
    if (planBannerTitle) {
      planBannerTitle.textContent = "Plan renewed • 36 days left";
    }
  });

  // Bottom Navigation Tabs
  el.navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTabId = item.getAttribute('data-tab');
      switchTab(targetTabId);
    });
  });

  function switchTab(tabId) {
    state.activeTab = tabId;

    el.navItems.forEach(nav => {
      if (nav.getAttribute('data-tab') === tabId) {
        nav.classList.add('active');
      } else {
        nav.classList.remove('active');
      }
    });

    el.tabPages.forEach(page => {
      if (page.id === tabId) {
        page.classList.add('active-tab');
      } else {
        page.classList.remove('active-tab');
      }
    });
  }

  // See All Upcoming button
  el.btnSeeAllUpcoming.addEventListener('click', () => {
    showToast("Showing full weekly schedule for school term.");
  });

  // Additional Profile / Plans helper buttons
  el.btnPauseCalendar?.addEventListener('click', () => {
    showToast("Holidays Calendar: Select festival or vacation dates to auto-pause.");
  });

  el.btnUpgradePlan?.addEventListener('click', () => {
    openModal(el.renewModal);
  });

  el.btnAddOfficePlan?.addEventListener('click', () => {
    state.currentRecipient = 'vikram';
    el.btnSwitchVikram.classList.add('active');
    el.btnSwitchAarav.classList.remove('active');
    renderView();
    switchTab('tabHome');
    showToast("Office Dabba activated for Vikram! Pickup set for 11:45 AM.");
  });

  el.btnNotification.addEventListener('click', () => {
    showToast("🔔 Rahul has crossed Indiranagar 100ft Rd. On schedule.");
  });

  el.btnManageAddresses?.addEventListener('click', () => {
    showToast("Addresses: Home (Lotus Greens 402) • School: Green Valley School Gate 2");
  });

  el.btnDabbaTags?.addEventListener('click', () => {
    showToast("Dabba Tag #GV-402 is registered with tamper-evident seal.");
  });

  el.btnEmergencyContacts?.addEventListener('click', () => {
    showToast("School Gate Desk: +91 80 2520 1900 verified");
  });

  el.btnPreferences?.addEventListener('click', () => {
    showToast("SMS & WhatsApp notifications enabled for Pickup, In-transit and Handover.");
  });

  // Toast System
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>🍱</span><span>${message}</span>`;
    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ------------------------------------------------------------------------
  // Progressive Web App (PWA) Setup & Installation Management
  // ------------------------------------------------------------------------
  let deferredInstallPrompt = null;

  // 1. Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('🍱 DabbaGo PWA Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('Service Worker registration skipped:', err);
        });
    });
  }

  // 2. Handle beforeinstallprompt (Android / Chrome / Edge)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    
    // Show in-app banner and top install button
    if (el.pwaInstallBanner) {
      el.pwaInstallBanner.style.display = 'flex';
    }
  });

  // Prompt installer function
  function triggerInstallFlow() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('🎉 Thank you for installing DabbaGo! App icon added to your phone.');
          if (el.pwaInstallBanner) el.pwaInstallBanner.style.display = 'none';
        }
        deferredInstallPrompt = null;
      });
    } else {
      // If native prompt is unavailable (e.g. on iOS Safari or desktop), open guide modal
      openModal(el.pwaGuideModal);
    }
  }

  // Connect install triggers
  el.btnPwaInstall?.addEventListener('click', triggerInstallFlow);
  el.btnTopInstall?.addEventListener('click', triggerInstallFlow);
  el.btnTriggerNativeInstall?.addEventListener('click', () => {
    closeModal(el.pwaGuideModal);
    triggerInstallFlow();
  });

  el.btnPwaDismiss?.addEventListener('click', () => {
    if (el.pwaInstallBanner) {
      el.pwaInstallBanner.style.display = 'none';
    }
  });

  el.btnClosePwaGuide?.addEventListener('click', () => closeModal(el.pwaGuideModal));
  el.pwaGuideModal?.addEventListener('click', (e) => {
    if (e.target === el.pwaGuideModal) closeModal(el.pwaGuideModal);
  });

  window.addEventListener('appinstalled', () => {
    showToast('🍱 DabbaGo is installed on your device! Ready for offline lunch tracking.');
    if (el.pwaInstallBanner) el.pwaInstallBanner.style.display = 'none';
    if (el.btnTopInstall) el.btnTopInstall.style.display = 'none';
  });

  // ------------------------------------------------------------------------
  // Authentication (Login, Signup, OTP Verification)
  // ------------------------------------------------------------------------
  let loginTimerInterval = null;
  let signupTimerInterval = null;

  function startOtpTimer(type = 'login') {
    const isLogin = type === 'login';
    const timerSecEl = isLogin ? el.loginTimerSec : el.signupTimerSec;
    const timerMsgEl = isLogin ? el.loginTimerMsg : el.signupTimerMsg;
    const resendBtnEl = isLogin ? el.btnResendLoginOtp : el.btnResendSignupOtp;
    const pillEl = isLogin ? el.loginTimerPill : el.signupTimerPill;

    // Reset active interval if already running
    if (isLogin && loginTimerInterval) {
      clearInterval(loginTimerInterval);
      loginTimerInterval = null;
    } else if (!isLogin && signupTimerInterval) {
      clearInterval(signupTimerInterval);
      signupTimerInterval = null;
    }

    let seconds = 30;

    function renderUI() {
      if (timerSecEl) timerSecEl.textContent = seconds;
      if (timerMsgEl) {
        timerMsgEl.style.display = 'inline-flex';
        timerMsgEl.innerHTML = `Resend in <strong id="${isLogin ? 'loginTimerSec' : 'signupTimerSec'}">${seconds}</strong>s`;
      }
      if (resendBtnEl) resendBtnEl.style.display = 'none';
      if (pillEl) {
        pillEl.classList.remove('expired');
        pillEl.textContent = `⏱ ${seconds}s`;
      }
    }

    renderUI();

    const intervalId = setInterval(() => {
      seconds -= 1;
      if (seconds > 0) {
        renderUI();
      } else {
        clearInterval(intervalId);
        if (isLogin) loginTimerInterval = null;
        else signupTimerInterval = null;

        if (timerMsgEl) timerMsgEl.style.display = 'none';
        if (resendBtnEl) {
          resendBtnEl.style.display = 'inline-block';
          resendBtnEl.textContent = 'Resend OTP';
        }
        if (pillEl) {
          pillEl.classList.add('expired');
          pillEl.textContent = '⏱ Expired • Resend OTP';
        }
      }
    }, 1000);

    if (isLogin) loginTimerInterval = intervalId;
    else signupTimerInterval = intervalId;
  }

  function stopOtpTimers() {
    if (loginTimerInterval) {
      clearInterval(loginTimerInterval);
      loginTimerInterval = null;
    }
    if (signupTimerInterval) {
      clearInterval(signupTimerInterval);
      signupTimerInterval = null;
    }
  }

  function openAuthView(step = 'login') {
    if (el.authView) {
      el.authView.classList.add('open');
      showAuthStep(step);
    }
  }

  function closeAuthView() {
    if (el.authView) {
      el.authView.classList.remove('open');
      stopOtpTimers();
    }
  }

  function showAuthStep(step) {
    if (!el.paneLogin || !el.paneSignup) return;
    
    if (step === 'signup') {
      el.paneSignup.classList.add('active');
      el.paneLogin.classList.remove('active');
      el.tabSwitchSignup?.classList.add('active');
      el.tabSwitchLogin?.classList.remove('active');
      if (el.btnAuthBack) el.btnAuthBack.style.visibility = 'visible';
      startOtpTimer('signup');
      setTimeout(() => el.signupName?.focus(), 150);
    } else {
      el.paneLogin.classList.add('active');
      el.paneSignup.classList.remove('active');
      el.tabSwitchLogin?.classList.add('active');
      el.tabSwitchSignup?.classList.remove('active');
      if (el.btnAuthBack) el.btnAuthBack.style.visibility = 'hidden';
      startOtpTimer('login');
      setTimeout(() => el.loginPhone?.focus(), 150);
    }
  }

  // Open / Close Auth Triggers
  el.btnOpenAuthModal?.addEventListener('click', () => openAuthView('login'));
  el.btnAuthClose?.addEventListener('click', closeAuthView);
  el.btnAuthBack?.addEventListener('click', () => showAuthStep('login'));

  // Segmented Tabs & Switch Links
  el.tabSwitchLogin?.addEventListener('click', () => showAuthStep('login'));
  el.tabSwitchSignup?.addEventListener('click', () => showAuthStep('signup'));
  el.btnGotoSignup?.addEventListener('click', () => showAuthStep('signup'));
  el.btnGotoLogin?.addEventListener('click', () => showAuthStep('login'));

  // Role Pill Selection in Signup
  el.rolePillOptions?.forEach(pill => {
    pill.addEventListener('click', () => {
      el.rolePillOptions.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const radio = pill.querySelector('input');
      if (radio) radio.checked = true;
    });
  });

  // Reusable 4-box OTP Controller with Auto-Submit on typing 4 digits
  function setupOtpInputs(inputs, onEnter) {
    if (!inputs || inputs.length === 0) return;

    function checkAutoSubmit() {
      let code = '';
      inputs.forEach(inp => {
        code += (inp.value || '').trim();
      });

      // When all 4 digits are typed, auto-submit
      if (code.length === 4 && /^[0-9]{4}$/.test(code)) {
        inputs.forEach(inp => inp.classList.add('otp-filled-success'));
        setTimeout(() => {
          inputs.forEach(inp => inp.classList.remove('otp-filled-success'));
          if (onEnter) onEnter();
        }, 130);
      }
    }

    inputs.forEach((input, index) => {
      // Focus & click: select content so typing immediately overwrites without issues
      input.addEventListener('focus', () => input.select());
      input.addEventListener('click', () => input.select());

      input.addEventListener('input', (e) => {
        const raw = e.target.value;
        const digits = raw.replace(/[^0-9]/g, '');

        // If multiple digits were pasted or autofilled:
        if (digits.length > 1) {
          const chars = digits.slice(0, 4).split('');
          chars.forEach((char, i) => {
            const targetIdx = index + i;
            if (inputs[targetIdx]) {
              inputs[targetIdx].value = char;
            }
          });
          const lastTarget = Math.min(index + chars.length - 1, inputs.length - 1);
          if (inputs[lastTarget]) inputs[lastTarget].focus();
          checkAutoSubmit();
          return;
        }

        // Single digit entry: set value and advance
        e.target.value = digits ? digits[0] : '';
        if (digits && index < inputs.length - 1) {
          inputs[index + 1].focus();
          inputs[index + 1].select();
        }

        // Auto-submit when all 4 digits are entered
        checkAutoSubmit();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
          if (!input.value && index > 0) {
            inputs[index - 1].focus();
            inputs[index - 1].select();
          }
        } else if (e.key === 'ArrowLeft' && index > 0) {
          inputs[index - 1].focus();
          inputs[index - 1].select();
        } else if (e.key === 'ArrowRight' && index < inputs.length - 1) {
          inputs[index + 1].focus();
          inputs[index + 1].select();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (onEnter) onEnter();
        }
      });

      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text').trim();
        const digits = pasted.replace(/[^0-9]/g, '').slice(0, 4).split('');
        digits.forEach((d, i) => {
          if (inputs[i]) inputs[i].value = d;
        });
        if (digits.length > 0) {
          const lastIdx = Math.min(digits.length - 1, inputs.length - 1);
          if (inputs[lastIdx]) inputs[lastIdx].focus();
        }
        checkAutoSubmit();
      });
    });
  }

  // Setup OTP inputs for both forms
  setupOtpInputs(el.loginOtpInputs, handleLoginSubmit);
  setupOtpInputs(el.signupOtpInputs, handleSignupSubmit);

  // Autofill helpers
  function fillOtpBoxes(inputs, code = '4829') {
    const chars = code.split('');
    inputs.forEach((inp, idx) => {
      inp.value = chars[idx] || '';
    });
  }

  el.btnDemoAutofillLogin?.addEventListener('click', () => {
    fillOtpBoxes(el.loginOtpInputs, '4829');
    showToast('Auto-filled OTP: 4829 ✓');
    setTimeout(() => handleLoginSubmit(), 160);
  });

  el.btnDemoAutofillSignup?.addEventListener('click', () => {
    fillOtpBoxes(el.signupOtpInputs, '4829');
    showToast('Auto-filled OTP: 4829 ✓');
    setTimeout(() => handleSignupSubmit(), 160);
  });

  el.btnResendLoginOtp?.addEventListener('click', () => {
    fillOtpBoxes(el.loginOtpInputs, '');
    el.loginOtpInputs?.[0]?.focus();
    startOtpTimer('login');
    showToast('📱 SMS sent: Your new OTP is 4829 (Valid for 30s)');
  });

  el.btnResendSignupOtp?.addEventListener('click', () => {
    fillOtpBoxes(el.signupOtpInputs, '');
    el.signupOtpInputs?.[0]?.focus();
    startOtpTimer('signup');
    showToast('📱 SMS sent: Your new OTP is 4829 (Valid for 30s)');
  });

  // Handle Login Form Submit (All in the same page)
  function handleLoginSubmit() {
    const phone = (el.loginPhone?.value || '').trim();
    if (phone.length < 10) {
      showToast('⚠️ Please enter a valid 10-digit mobile number');
      el.loginPhone?.focus();
      return;
    }

    let enteredOtp = '';
    el.loginOtpInputs?.forEach(inp => {
      enteredOtp += (inp.value || '').trim();
    });

    if (enteredOtp.length < 4) {
      showToast('⚠️ Please enter the 4-digit OTP (e.g. 4829)');
      const emptyBox = Array.from(el.loginOtpInputs || []).find(inp => !inp.value);
      if (emptyBox) emptyBox.focus();
      return;
    }

    if (!/^[0-9]{4}$/.test(enteredOtp)) {
      showToast('⚠️ Please enter 4 numeric digits for OTP');
      return;
    }

    // Success! Save user
    const existing = state.currentUser || {};
    const userToSave = {
      name: (existing.phone === phone && existing.name) ? existing.name : 'Priya Sharma',
      phone: phone,
      area: (existing.phone === phone && existing.area) ? existing.area : 'Indiranagar',
      deliveryFor: existing.deliveryFor || 'school'
    };

    state.currentUser = userToSave;
    try {
      localStorage.setItem('dabbago_user', JSON.stringify(userToSave));
    } catch (e) {}

    renderView();
    closeAuthView();
    const firstName = (userToSave.name || 'Friend').split(' ')[0] || 'Friend';
    showToast(`🎉 Verified! Welcome back to DabbaGo, ${firstName}.`);
  }

  el.btnSubmitLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    handleLoginSubmit();
  });
  el.formLogin?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLoginSubmit();
  });

  // Handle Signup Form Submit (All in the same page)
  function handleSignupSubmit() {
    const name = (el.signupName?.value || '').trim();
    const phone = (el.signupPhone?.value || '').trim();
    const area = el.signupArea?.value || 'Indiranagar';
    const deliveryFor = document.querySelector('input[name="signupDeliveryFor"]:checked')?.value || 'school';

    if (!name) {
      showToast('⚠️ Please enter your full name');
      el.signupName?.focus();
      return;
    }
    if (phone.length < 10) {
      showToast('⚠️ Please enter a valid 10-digit mobile number');
      el.signupPhone?.focus();
      return;
    }

    let enteredOtp = '';
    el.signupOtpInputs?.forEach(inp => {
      enteredOtp += (inp.value || '').trim();
    });

    if (enteredOtp.length < 4) {
      showToast('⚠️ Please enter the 4-digit OTP (e.g. 4829)');
      const emptyBox = Array.from(el.signupOtpInputs || []).find(inp => !inp.value);
      if (emptyBox) emptyBox.focus();
      return;
    }

    if (!/^[0-9]{4}$/.test(enteredOtp)) {
      showToast('⚠️ Please enter 4 numeric digits for OTP');
      return;
    }

    // Success! Save user
    const userToSave = {
      name: name,
      phone: phone,
      area: area,
      deliveryFor: deliveryFor
    };

    state.currentUser = userToSave;
    try {
      localStorage.setItem('dabbago_user', JSON.stringify(userToSave));
    } catch (e) {}

    if (userToSave.deliveryFor === 'office') {
      state.currentRecipient = 'vikram';
      el.btnSwitchVikram?.classList.add('active');
      el.btnSwitchAarav?.classList.remove('active');
    }

    renderView();
    closeAuthView();
    const firstName = name.split(' ')[0] || 'Friend';
    showToast(`🎉 Verified! Welcome to DabbaGo, ${firstName}.`);
  }

  el.btnSubmitSignup?.addEventListener('click', (e) => {
    e.preventDefault();
    handleSignupSubmit();
  });
  el.formSignup?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSignupSubmit();
  });

  // Logout User
  el.btnLogoutUser?.addEventListener('click', () => {
    state.currentUser = null;
    try {
      localStorage.removeItem('dabbago_user');
    } catch (e) {}
    renderView();
    openAuthView('login');
    showToast('Logged out successfully.');
  });

  // Initial render
  renderView();
});
