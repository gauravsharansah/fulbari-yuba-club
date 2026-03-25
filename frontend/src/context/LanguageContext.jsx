import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // ── Navbar ──
    nav_home: 'Home', nav_about: 'About', nav_programs: 'Programs',
    nav_awards: 'Awards', nav_blog: 'Blog', nav_gallery: 'Gallery',
    nav_team: 'Team', nav_contact: 'Contact', nav_admin: 'Admin',
    nav_dashboard: 'Dashboard', nav_logout: 'Sign Out',
    nav_est: 'Jakma · Est. 2057 BS',

    // ── Hero ──
    hero_badge: 'Jakma, Manyavangyag-6, Okhaldhunga',
    hero_title: 'Fulbari Yuba Club',
    hero_subtitle: 'JAKMA — F.Y.C',
    hero_nepali_line: 'फुलबारी युवा क्लव जाक्मा',
    hero_desc: 'A hub for youth, sports, culture & community growth. Nurturing talent and fostering community development since 2057 BS.',
    hero_btn_programs: 'View Programs',
    hero_btn_about: 'About Club',
    hero_est_badge: 'Est. 2057 BS · स्था: २०५७',

    // ── Stats ──
    stat_followers: 'Facebook Followers',
    stat_posts: 'Social Media Posts',
    stat_established: 'Established (BS)',
    stat_programs_year: 'Programs Per Year',

    // ── About strip ──
    strip1_title: 'Football Excellence',
    strip1_desc: 'Promoting football at grassroots level in Okhaldhunga, nurturing young talent since 2057 BS.',
    strip2_title: 'Community Growth',
    strip2_desc: 'A hub for youth development, culture, and social upliftment across Manyavangyag rural municipality.',
    strip3_title: 'Winning Legacy',
    strip3_desc: 'Multiple tournament victories and certificates of excellence from district and zonal competitions.',

    // ── Home sections ──
    home_recent_tag: 'Latest Activities',
    home_recent_title: 'Recent Programs',
    home_recent_sub: 'Events, tournaments, and community activities organized by FYC Jakma',
    home_view_all: 'View All Programs →',
    home_president_tag: "President's Message",
    home_president_quote: '"Fulbari Yuba Club Jakma stands as a beacon of hope and determination for the youth of Manyavangyag. Our journey since 2057 BS has been one of unity, resilience, and passion for football and community development. Together, we build not just a football club — but a family."',
    home_president_name: 'Mr. Amrit Bahadur Rai',
    home_president_role: 'Club President',
    home_president_link: 'Read More About Us →',
    home_cta_title: 'Be Part of Our Journey',
    home_cta_desc: 'Join Fulbari Yuba Club Jakma and become part of a growing community of young sportspersons.',
    home_cta_btn1: 'Contact Us',
    home_cta_btn2: 'Follow on Facebook',

    // ── About page ──
    about_hero_tag: 'Our Story',
    about_hero_title: 'About Fulbari Yuba Club Jakma',
    about_hero_sub: 'फुलबारी युवा क्लव जाक्मा — Est. 2057 BS',
    about_tag: 'फुलबारी युवा क्लव',
    about_h2: 'A Club Built on Passion & Community',
    about_p1: 'Fulbari Yuba Club Jakma (F.Y.C) is a dynamic youth football club established in 2057 BS in the beautiful locality of Jakma, Manyavangyag Gaun Palika-6, Okhaldhunga, Nepal.',
    about_p2: 'Founded with the vision of nurturing local football talent and fostering community development, FYC has grown into one of the most respected youth organizations in Okhaldhunga district.',
    about_p3: 'Over the years, the club has organized numerous tournaments, cultural programs, community events, and social initiatives that have positively impacted hundreds of families across Manyavangyag rural municipality.',
    about_info_founded: 'Founded', about_info_founded_val: '2057 BS (Nepal)',
    about_info_loc: 'Location', about_info_loc_val: 'Jakma, Okhaldhunga',
    about_info_cat: 'Category', about_info_cat_val: 'Youth Football Club',
    about_info_fb: 'Facebook', about_info_fb_val: '434 Followers',
    about_mission_tag: 'Purpose', about_mission_title: 'Mission & Vision',
    about_mission_label: 'Our Purpose', about_mission_h: 'Mission',
    about_mission_desc: 'To discover, nurture, and develop young football talent from the hills of Okhaldhunga while promoting youth leadership, social harmony, and community empowerment through sports and cultural activities.',
    about_vision_label: 'Our Dream', about_vision_h: 'Vision',
    about_vision_desc: 'To become the premier youth football institution of Okhaldhunga district, producing nationally recognized players and fostering a culture of sportsmanship, unity, and positive change in our community.',
    about_values_tag: 'What We Stand For', about_values_title: 'Our Core Values',
    val1_title: 'Sportsmanship', val1_desc: 'Fair play, respect, and integrity on and off the field.',
    val2_title: 'Unity', val2_desc: 'Building strong bonds within the community through sport.',
    val3_title: 'Development', val3_desc: 'Continuous growth of youth skills and potential.',
    val4_title: 'Resilience', val4_desc: 'The spirit of the hills — never giving up.',
    about_lead_tag: 'Leadership', about_lead_title: 'Executive Committee',
    about_join_title: 'Want to Join FYC Jakma?',
    about_join_desc: 'Become part of our growing family of football enthusiasts and community builders.',
    about_join_btn: 'Get In Touch',
    exec_president: 'President', exec_vp: 'Vice President',
    exec_sec: 'General Secretary', exec_treas: 'Finance & Treasurer',
    exec_since: 'Executive Committee',

    // ── Programs ──
    prog_hero_tag: 'Activities & Events',
    prog_hero_title: 'Programs & Events',
    prog_hero_sub: 'All activities, tournaments, and community events organized by Fulbari Yuba Club Jakma',
    filter_all: 'All Programs', filter_tournament: 'Tournaments',
    filter_community: 'Community', filter_cultural: 'Cultural', filter_training: 'Training',
    prog_empty: 'No programs found',
    prog_add_btn: '+ Post New Program',
    prog_participants: 'participants',
    prog_location: 'Location', prog_date_label: 'Date',

    // ── Awards ──
    award_hero_tag: 'Achievements',
    award_hero_title: 'Awards & Certificates',
    award_hero_sub: 'Recognition and achievements earned by Fulbari Yuba Club Jakma',
    award_add_btn: '+ Add Award',

    // ── Blog ──
    blog_hero_tag: 'News & Stories',
    blog_hero_title: 'Club Blog',
    blog_hero_sub: 'Latest news, match reports, and stories from FYC Jakma',
    blog_featured_badge: 'Featured',
    blog_add_btn: '+ Write Blog Post',
    blog_all: 'All Posts',
    blog_by: 'By',

    // ── Gallery ──
    gallery_hero_tag: 'Memories',
    gallery_hero_title: 'Photo Gallery',
    gallery_hero_sub: 'Moments captured from our programs, matches, and community events',
    gallery_add_btn: '+ Add Photos',
    gallery_all: 'All Photos',

    // ── Team ──
    team_hero_tag: 'Our People',
    team_hero_title: 'Club Members',
    team_hero_sub: 'The players, coaches, and officials that make FYC Jakma great',
    member_since: 'Since',

    // ── Contact ──
    contact_hero_tag: 'Get In Touch',
    contact_hero_title: 'Contact Us',
    contact_hero_sub: 'Reach out to Fulbari Yuba Club Jakma',
    contact_info_h: 'Club Information',
    contact_addr_label: 'Address',
    contact_addr_val: 'Jakma, Manyavangyag Gaun Palika-6\nOkhaldhunga, Nepal - 56100',
    contact_fb_label: 'Facebook',
    contact_fb_val: 'fulbariyubaclub\n434 Followers · 91 Posts',
    contact_region_label: 'Region',
    contact_region_val: 'Okhaldhunga · Manebhanjyang, Nepal',
    contact_founded_label: 'Founded',
    contact_founded_val: '2057 BS (Bikram Sambat)',
    contact_hours_title: 'FYC Club Hours',
    contact_hours_val: 'Open Daily — Active Community Club\nPractice: Morning & Evening\nOffice: 10:00 AM – 5:00 PM',
    contact_form_h: 'Send a Message',
    contact_name: 'Full Name', contact_name_ph: 'Your name',
    contact_phone: 'Phone', contact_phone_ph: '+977...',
    contact_email: 'Email', contact_email_ph: 'your@email.com',
    contact_subject: 'Subject', contact_subject_ph: 'Subject of your message',
    contact_message: 'Message', contact_message_ph: 'Write your message here...',
    contact_send: 'Send Message →', contact_sending: 'Sending...',
    contact_success: 'Message sent! We will get back to you soon.',
    contact_error: 'Failed to send. Please try again.',

    // ── Footer ──
    footer_tagline: 'A hub for youth, sports, culture & community growth.\nManyavangyag Gaun Palika-6, Okhaldhunga, Nepal.',
    footer_pages: 'Pages', footer_club: 'Club', footer_contact_h: 'Contact',
    footer_team: 'Team Members', footer_awards: 'Awards', footer_rights: '© 2081 BS Fulbari Yuba Club Jakma. All rights reserved.',
    footer_made: 'Made with ❤️ in Nepal',

    // ── Admin Modal ──
    admin_modal_title: 'Admin Login',
    admin_modal_sub: 'Sign in to manage the club website',
    admin_email_label: 'Admin Email',
    admin_email_ph: 'Enter admin email',
    admin_pass_label: 'Password',
    admin_pass_ph: 'Enter admin password',
    admin_btn: 'Login as Admin',
    admin_btn_loading: 'Logging in...',
    admin_error: 'Invalid credentials. Please try again.',
    admin_cancel: 'Cancel',

    // ── Post modals ──
    post_prog_title: '📋 Post New Program',
    post_award_title: '🏆 Add New Award',
    post_blog_title: '✏️ Write New Blog Post',
    post_gallery_title: '📸 Add Photos to Gallery',
    field_title: 'Title', field_category: 'Category', field_date: 'Date',
    field_location: 'Location', field_short_desc: 'Short Description',
    field_full_desc: 'Full Details', field_status: 'Status',
    field_photos: 'Photos', field_organizer: 'Organizer',
    field_participants: 'Participants (approx.)',
    field_issued_by: 'Issued By', field_year_bs: 'Year (BS)',
    field_icon: 'Icon (Emoji)', field_description: 'Description',
    field_author: 'Author', field_summary: 'Summary',
    field_content: 'Full Content', field_tags: 'Tags (comma-separated)',
    field_caption: 'Caption',
    btn_publish: 'Publish', btn_add: 'Add', btn_upload: 'Upload Photos',
    btn_cancel: 'Cancel', btn_saving: 'Saving...',
    photo_select_hint: 'Click to select photos',
    photo_select_sub: 'JPG, PNG, WebP · Multiple files · Max 5MB each',
    photo_selected: 'photo(s) selected',
    required_fields: 'Please fill all required fields.',

    // ── Status / Category labels ──
    status_upcoming: 'Upcoming', status_active: 'Ongoing',
    status_past: 'Completed', status_draft: 'Draft',
    cat_tournament: 'Tournament', cat_community: 'Community',
    cat_cultural: 'Cultural', cat_training: 'Training', cat_other: 'Other',
    cat_news: 'News', cat_match: 'Match Report',
    cat_announcement: 'Announcement', cat_achievement: 'Achievement',

    // ── Confirm / actions ──
    confirm_delete: 'Are you sure you want to delete this?',
    delete_btn: '🗑 Delete',
    delete_disabled_title: 'Can only be deleted within 5 days of posting. Please remove from code.',

    // ── Admin dashboard ──
    adm_back: '← Back to Website', adm_role: 'Administrator',
    adm_tip: '💡 Tip: When logged in as admin, you\'ll see "+ Post" buttons directly on the Programs, Awards, Blog, and Gallery pages.',
    adm_stat_programs: 'Programs', adm_stat_members: 'Members',
    adm_stat_blogs: 'Blog Posts', adm_stat_awards: 'Awards',
    adm_panel_dashboard: 'Dashboard', adm_panel_post_prog: 'Post Program',
    adm_panel_manage_prog: 'Manage Programs', adm_panel_post_blog: 'Write Blog',
    adm_panel_manage_blog: 'Manage Blogs', adm_panel_certs: 'Awards',
    adm_panel_gallery: 'Gallery', adm_panel_members: 'Members',
    adm_panel_admins: 'Manage Admins', adm_panel_messages: 'Messages',
    adm_logout: 'Logout',
    adm_recent_prog: '📋 Recent Programs',
    adm_recent_blogs: '📰 Recent Blog Posts',
    adm_all_prog: '📋 All Programs', adm_all_blogs: '📰 All Blog Posts',
    adm_all_awards: 'All Awards', adm_all_members: 'All Members',
    adm_admins_info: '💡 You can add additional admin accounts here. Each admin has full access to manage the website.',
    adm_add_admin: '🔐 Add New Admin Account',
    adm_current_admins: 'Current Admins',
    adm_you: 'You (cannot delete)',
    adm_messages_title: '💬 Contact Messages',
    adm_unread: 'unread',
    col_title: 'Title', col_category: 'Category', col_date: 'Date',
    col_status: 'Status', col_actions: 'Actions', col_location: 'Location',
    col_author: 'Author', col_icon: 'Icon', col_issued: 'Issued By',
    col_year: 'Year', col_name: 'Name', col_email: 'Email',
    col_position: 'Position', col_jersey: 'Jersey', col_since: 'Since',
    col_created: 'Created', col_subject: 'Subject', col_message: 'Message',
    no_data: 'No data found', add_new: '+ New',
  },

  np: {
    // ── Navbar ──
    nav_home: 'गृहपृष्ठ', nav_about: 'हाम्रो बारे', nav_programs: 'कार्यक्रमहरू',
    nav_awards: 'पुरस्कारहरू', nav_blog: 'ब्लग', nav_gallery: 'ग्यालेरी',
    nav_team: 'टोली', nav_contact: 'सम्पर्क', nav_admin: 'प्रशासक',
    nav_dashboard: 'ड्यासबोर्ड', nav_logout: 'बाहिर निस्कनुहोस्',
    nav_est: 'जाक्मा · स्था: २०५७ बि.सं.',

    // ── Hero ──
    hero_badge: 'जाक्मा, मानेभञ्ज्याङ-६, ओखलढुङ्गा',
    hero_title: 'फुलबारी युवा क्लव',
    hero_subtitle: 'जाक्मा — एफ.वाई.सी.',
    hero_nepali_line: 'Fulbari Yuba Club Jakma',
    hero_desc: 'युवा, खेलकुद, संस्कृति र सामुदायिक विकासको केन्द्र। २०५७ बि.सं. देखि प्रतिभाको पोषण र सामुदायिक विकास गर्दै आएका छौं।',
    hero_btn_programs: 'कार्यक्रमहरू हेर्नुहोस्',
    hero_btn_about: 'क्लबको बारेमा',
    hero_est_badge: 'स्था: २०५७ बि.सं. · Est. 2057 BS',

    // ── Stats ──
    stat_followers: 'फेसबुक फलोअरहरू',
    stat_posts: 'सामाजिक सञ्जाल पोस्टहरू',
    stat_established: 'स्थापना वर्ष (बि.सं.)',
    stat_programs_year: 'वार्षिक कार्यक्रमहरू',

    // ── About strip ──
    strip1_title: 'फुटबल उत्कृष्टता',
    strip1_desc: 'ओखलढुङ्गामा आधारभूत तहमा फुटबलको प्रवर्धन, २०५७ बि.सं. देखि युवा प्रतिभाहरूको पोषण गर्दै।',
    strip2_title: 'सामुदायिक विकास',
    strip2_desc: 'मानेभञ्ज्याङ गाउँपालिकाभरि युवा विकास, संस्कृति र सामाजिक उत्थानको केन्द्र।',
    strip3_title: 'विजयी परम्परा',
    strip3_desc: 'जिल्ला र क्षेत्रीय प्रतियोगिताहरूबाट धेरै टूर्नामेन्ट जित र उत्कृष्टताका प्रमाणपत्रहरू।',

    // ── Home sections ──
    home_recent_tag: 'हालका गतिविधिहरू',
    home_recent_title: 'हालका कार्यक्रमहरू',
    home_recent_sub: 'FYC जाक्माले आयोजना गरेका कार्यक्रमहरू, टूर्नामेन्टहरू र सामुदायिक गतिविधिहरू',
    home_view_all: 'सबै कार्यक्रमहरू हेर्नुहोस् →',
    home_president_tag: 'अध्यक्षको सन्देश',
    home_president_quote: '"फुलबारी युवा क्लव जाक्मा मानेभञ्ज्याङका युवाहरूको लागि आशा र दृढताको प्रतीक हो। २०५७ बि.सं. देखिको हाम्रो यात्रा एकता, दृढता र फुटबल तथा सामुदायिक विकासप्रतिको जोशले भरिएको छ। हामी मिलेर एउटा फुटबल क्लब मात्र नभई — एउटा परिवार बनाउँछौं।"',
    home_president_name: 'श्री अमृत बहादुर राई',
    home_president_role: 'क्लब अध्यक्ष',
    home_president_link: 'हाम्रो बारेमा थप पढ्नुहोस् →',
    home_cta_title: 'हाम्रो यात्राको हिस्सा बन्नुहोस्',
    home_cta_desc: 'फुलबारी युवा क्लव जाक्मामा सामेल हुनुहोस् र युवा खेलाडीहरूको बढ्दो समुदायको हिस्सा बन्नुहोस्।',
    home_cta_btn1: 'सम्पर्क गर्नुहोस्',
    home_cta_btn2: 'फेसबुकमा फलो गर्नुहोस्',

    // ── About page ──
    about_hero_tag: 'हाम्रो कथा',
    about_hero_title: 'फुलबारी युवा क्लव जाक्माको बारेमा',
    about_hero_sub: 'Fulbari Yuba Club Jakma — स्था: २०५७ बि.सं.',
    about_tag: 'फुलबारी युवा क्लव',
    about_h2: 'जोश र समुदायमा निर्मित क्लब',
    about_p1: 'फुलबारी युवा क्लव जाक्मा (एफ.वाई.सी.) नेपालको ओखलढुङ्गा जिल्लाको मानेभञ्ज्याङ गाउँपालिका-६ को सुन्दर जाक्मामा २०५७ बि.सं. मा स्थापित एक गतिशील युवा फुटबल क्लब हो।',
    about_p2: 'स्थानीय फुटबल प्रतिभा पोषण गर्ने र सामुदायिक विकासलाई प्रोत्साहन दिने दृष्टिकोणले स्थापित यस क्लबले ओखलढुङ्गा जिल्लाका सबैभन्दा सम्मानित युवा संगठनमध्ये एक बन्न सफल भएको छ।',
    about_p3: 'वर्षौंको क्रममा, क्लबले धेरै टूर्नामेन्ट, सांस्कृतिक कार्यक्रम, सामुदायिक कार्यक्रम र सामाजिक पहलहरू आयोजना गरेको छ जसले मानेभञ्ज्याङ गाउँपालिकाभरि सयौं परिवारहरूमा सकारात्मक प्रभाव पारेको छ।',
    about_info_founded: 'स्थापना', about_info_founded_val: '२०५७ बि.सं. (नेपाल)',
    about_info_loc: 'स्थान', about_info_loc_val: 'जाक्मा, ओखलढुङ्गा',
    about_info_cat: 'वर्ग', about_info_cat_val: 'युवा फुटबल क्लब',
    about_info_fb: 'फेसबुक', about_info_fb_val: '४३४ फलोअरहरू',
    about_mission_tag: 'उद्देश्य', about_mission_title: 'लक्ष्य र दृष्टिकोण',
    about_mission_label: 'हाम्रो उद्देश्य', about_mission_h: 'लक्ष्य',
    about_mission_desc: 'ओखलढुङ्गाका पहाडहरूबाट युवा फुटबल प्रतिभाहरू खोज्न, पोषण गर्न र विकास गर्न, साथै खेलकुद र सांस्कृतिक गतिविधिहरू मार्फत युवा नेतृत्व, सामाजिक सद्भाव र सामुदायिक सशक्तिकरणलाई प्रवर्धन गर्न।',
    about_vision_label: 'हाम्रो सपना', about_vision_h: 'दृष्टिकोण',
    about_vision_desc: 'ओखलढुङ्गा जिल्लाको प्रमुख युवा फुटबल संस्था बन्न, राष्ट्रिय स्तरमा चिनिने खेलाडीहरू उत्पादन गर्न र हाम्रो समुदायमा खेलकुद भावना, एकता र सकारात्मक परिवर्तनको संस्कृति पोषण गर्न।',
    about_values_tag: 'हाम्रा मूल्यहरू', about_values_title: 'हाम्रा मूल मूल्यहरू',
    val1_title: 'खेलकुद भावना', val1_desc: 'मैदानमा र बाहिर निष्पक्ष खेल, सम्मान र ईमानदारी।',
    val2_title: 'एकता', val2_desc: 'खेलकुद मार्फत समुदायभित्र बलियो सम्बन्ध निर्माण।',
    val3_title: 'विकास', val3_desc: 'युवा सीप र क्षमताको निरन्तर विकास।',
    val4_title: 'दृढता', val4_desc: 'पहाडको भावना — कहिल्यै हार नमान्ने।',
    about_lead_tag: 'नेतृत्व', about_lead_title: 'कार्यकारी समिति',
    about_join_title: 'FYC जाक्मामा सामेल हुन चाहनुहुन्छ?',
    about_join_desc: 'फुटबल उत्साही र सामुदायिक निर्माताहरूको हाम्रो बढ्दो परिवारको हिस्सा बन्नुहोस्।',
    about_join_btn: 'सम्पर्क गर्नुहोस्',
    exec_president: 'अध्यक्ष', exec_vp: 'उपाध्यक्ष',
    exec_sec: 'महासचिव', exec_treas: 'कोषाध्यक्ष',
    exec_since: 'कार्यकारी समिति',

    // ── Programs ──
    prog_hero_tag: 'गतिविधि र कार्यक्रमहरू',
    prog_hero_title: 'कार्यक्रम र आयोजनाहरू',
    prog_hero_sub: 'फुलबारी युवा क्लव जाक्माले आयोजना गरेका सबै गतिविधिहरू, टूर्नामेन्टहरू र सामुदायिक कार्यक्रमहरू',
    filter_all: 'सबै कार्यक्रमहरू', filter_tournament: 'टूर्नामेन्टहरू',
    filter_community: 'सामुदायिक', filter_cultural: 'सांस्कृतिक', filter_training: 'तालिम',
    prog_empty: 'कुनै कार्यक्रम फेला परेन',
    prog_add_btn: '+ नयाँ कार्यक्रम थप्नुहोस्',
    prog_participants: 'सहभागीहरू',
    prog_location: 'स्थान', prog_date_label: 'मिति',

    // ── Awards ──
    award_hero_tag: 'उपलब्धिहरू',
    award_hero_title: 'पुरस्कार र प्रमाणपत्रहरू',
    award_hero_sub: 'फुलबारी युवा क्लव जाक्माले प्राप्त गरेका मान्यता र उपलब्धिहरू',
    award_add_btn: '+ पुरस्कार थप्नुहोस्',

    // ── Blog ──
    blog_hero_tag: 'समाचार र कथाहरू',
    blog_hero_title: 'क्लब ब्लग',
    blog_hero_sub: 'FYC जाक्माबाट ताजा समाचार, म्याच रिपोर्ट र कथाहरू',
    blog_featured_badge: 'विशेष',
    blog_add_btn: '+ ब्लग पोस्ट लेख्नुहोस्',
    blog_all: 'सबै पोस्टहरू',
    blog_by: 'लेखक',

    // ── Gallery ──
    gallery_hero_tag: 'यादहरू',
    gallery_hero_title: 'फोटो ग्यालेरी',
    gallery_hero_sub: 'हाम्रा कार्यक्रमहरू, म्याचहरू र सामुदायिक कार्यक्रमहरूबाट कैद भएका क्षणहरू',
    gallery_add_btn: '+ फोटोहरू थप्नुहोस्',
    gallery_all: 'सबै फोटोहरू',

    // ── Team ──
    team_hero_tag: 'हाम्रा मानिसहरू',
    team_hero_title: 'क्लब सदस्यहरू',
    team_hero_sub: 'FYC जाक्मालाई महान् बनाउने खेलाडीहरू, कोचहरू र अधिकारीहरू',
    member_since: 'देखि',

    // ── Contact ──
    contact_hero_tag: 'सम्पर्कमा आउनुहोस्',
    contact_hero_title: 'सम्पर्क गर्नुहोस्',
    contact_hero_sub: 'फुलबारी युवा क्लव जाक्मामा सम्पर्क गर्नुहोस्',
    contact_info_h: 'क्लब जानकारी',
    contact_addr_label: 'ठेगाना',
    contact_addr_val: 'जाक्मा, मानेभञ्ज्याङ गाउँपालिका-६\nओखलढुङ्गा, नेपाल - ५६१००',
    contact_fb_label: 'फेसबुक',
    contact_fb_val: 'fulbariyubaclub\n४३४ फलोअरहरू · ९१ पोस्टहरू',
    contact_region_label: 'क्षेत्र',
    contact_region_val: 'ओखलढुङ्गा · मानेभञ्ज्याङ, नेपाल',
    contact_founded_label: 'स्थापना',
    contact_founded_val: '२०५७ बि.सं. (बिक्रम सम्बत)',
    contact_hours_title: 'FYC क्लब समय',
    contact_hours_val: 'दैनिक खुला — सक्रिय सामुदायिक क्लब\nअभ्यास: बिहान र साँझ\nकार्यालय: बिहान १०:०० - साँझ ५:००',
    contact_form_h: 'सन्देश पठाउनुहोस्',
    contact_name: 'पूरा नाम', contact_name_ph: 'तपाईंको नाम',
    contact_phone: 'फोन नम्बर', contact_phone_ph: '+९७७...',
    contact_email: 'इमेल ठेगाना', contact_email_ph: 'your@email.com',
    contact_subject: 'विषय', contact_subject_ph: 'सन्देशको विषय लेख्नुहोस्',
    contact_message: 'सन्देश', contact_message_ph: 'यहाँ आफ्नो सन्देश लेख्नुहोस्...',
    contact_send: 'सन्देश पठाउनुहोस् →', contact_sending: 'पठाउँदैछ...',
    contact_success: 'सन्देश पठाइयो! हामी चाँडै तपाईंलाई जवाफ दिनेछौं।',
    contact_error: 'सन्देश पठाउन असफल। कृपया फेरि प्रयास गर्नुहोस्।',

    // ── Footer ──
    footer_tagline: 'युवा, खेलकुद, संस्कृति र सामुदायिक विकासको केन्द्र।\nमानेभञ्ज्याङ गाउँपालिका-६, ओखलढुङ्गा, नेपाल।',
    footer_pages: 'पृष्ठहरू', footer_club: 'क्लब', footer_contact_h: 'सम्पर्क',
    footer_team: 'टोली सदस्यहरू', footer_awards: 'पुरस्कारहरू',
    footer_rights: '© २०८१ बि.सं. फुलबारी युवा क्लव जाक्मा। सर्वाधिकार सुरक्षित।',
    footer_made: 'नेपालमा ❤️ सहित बनाइएको',

    // ── Admin Modal ──
    admin_modal_title: 'प्रशासक लगइन',
    admin_modal_sub: 'क्लब वेबसाइट व्यवस्थापन गर्न साइन इन गर्नुहोस्',
    admin_email_label: 'प्रशासक इमेल',
    admin_email_ph: 'प्रशासक इमेल लेख्नुहोस्',
    admin_pass_label: 'पासवर्ड',
    admin_pass_ph: 'पासवर्ड लेख्नुहोस्',
    admin_btn: 'प्रशासकको रूपमा लगइन गर्नुहोस्',
    admin_btn_loading: 'लगइन हुँदैछ...',
    admin_error: 'अमान्य प्रमाणपत्र। कृपया फेरि प्रयास गर्नुहोस्।',
    admin_cancel: 'रद्द गर्नुहोस्',

    // ── Post modals ──
    post_prog_title: '📋 नयाँ कार्यक्रम थप्नुहोस्',
    post_award_title: '🏆 नयाँ पुरस्कार थप्नुहोस्',
    post_blog_title: '✏️ नयाँ ब्लग पोस्ट लेख्नुहोस्',
    post_gallery_title: '📸 ग्यालेरीमा फोटोहरू थप्नुहोस्',
    field_title: 'शीर्षक', field_category: 'वर्ग', field_date: 'मिति',
    field_location: 'स्थान', field_short_desc: 'छोटो विवरण',
    field_full_desc: 'पूर्ण विवरण', field_status: 'अवस्था',
    field_photos: 'फोटोहरू', field_organizer: 'आयोजक',
    field_participants: 'सहभागीहरू (अनुमानित)',
    field_issued_by: 'जारी गर्ने संस्था', field_year_bs: 'वर्ष (बि.सं.)',
    field_icon: 'चिह्न (Emoji)', field_description: 'विवरण',
    field_author: 'लेखक', field_summary: 'सारांश',
    field_content: 'पूर्ण सामग्री', field_tags: 'ट्यागहरू (अल्पविराम छुट्याएर)',
    field_caption: 'क्याप्सन',
    btn_publish: 'प्रकाशित गर्नुहोस्', btn_add: 'थप्नुहोस्', btn_upload: 'फोटोहरू अपलोड गर्नुहोस्',
    btn_cancel: 'रद्द गर्नुहोस्', btn_saving: 'सुरक्षित गर्दैछ...',
    photo_select_hint: 'फोटोहरू चयन गर्न क्लिक गर्नुहोस्',
    photo_select_sub: 'JPG, PNG, WebP · धेरै फाइलहरू · अधिकतम ५MB प्रत्येक',
    photo_selected: 'फोटो चयन भयो',
    required_fields: 'कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्।',

    // ── Status / Category labels ──
    status_upcoming: 'आउँदो', status_active: 'चलिरहेको',
    status_past: 'सम्पन्न', status_draft: 'मस्यौदा',
    cat_tournament: 'टूर्नामेन्ट', cat_community: 'सामुदायिक',
    cat_cultural: 'सांस्कृतिक', cat_training: 'तालिम', cat_other: 'अन्य',
    cat_news: 'समाचार', cat_match: 'म्याच रिपोर्ट',
    cat_announcement: 'घोषणा', cat_achievement: 'उपलब्धि',

    // ── Confirm / actions ──
    confirm_delete: 'के तपाईं यो मेटाउन चाहनुहुन्छ?',
    delete_btn: '🗑 मेटाउनुहोस्',
    delete_disabled_title: '५ दिन पछि मेटाउन मिल्दैन। कोडबाट हटाउनुहोस्।',

    // ── Admin dashboard ──
    adm_back: '← वेबसाइटमा फर्कनुहोस्', adm_role: 'प्रशासक',
    adm_tip: '💡 सुझाव: प्रशासकको रूपमा लगइन गर्दा, कार्यक्रम, पुरस्कार, ब्लग र ग्यालेरी पृष्ठहरूमा "+ थप्नुहोस्" बटनहरू देखिनेछन्।',
    adm_stat_programs: 'कार्यक्रमहरू', adm_stat_members: 'सदस्यहरू',
    adm_stat_blogs: 'ब्लग पोस्टहरू', adm_stat_awards: 'पुरस्कारहरू',
    adm_panel_dashboard: 'ड्यासबोर्ड', adm_panel_post_prog: 'कार्यक्रम पोस्ट',
    adm_panel_manage_prog: 'कार्यक्रम व्यवस्थापन', adm_panel_post_blog: 'ब्लग लेख्नुहोस्',
    adm_panel_manage_blog: 'ब्लग व्यवस्थापन', adm_panel_certs: 'पुरस्कारहरू',
    adm_panel_gallery: 'ग्यालेरी', adm_panel_members: 'सदस्यहरू',
    adm_panel_admins: 'प्रशासक व्यवस्थापन', adm_panel_messages: 'सन्देशहरू',
    adm_logout: 'बाहिर निस्कनुहोस्',
    adm_recent_prog: '📋 हालका कार्यक्रमहरू',
    adm_recent_blogs: '📰 हालका ब्लग पोस्टहरू',
    adm_all_prog: '📋 सबै कार्यक्रमहरू', adm_all_blogs: '📰 सबै ब्लग पोस्टहरू',
    adm_all_awards: 'सबै पुरस्कारहरू', adm_all_members: 'सबै सदस्यहरू',
    adm_admins_info: '💡 तपाईं यहाँ थप प्रशासक खाताहरू थप्न सक्नुहुन्छ। प्रत्येक प्रशासकलाई वेबसाइट व्यवस्थापन गर्न पूर्ण पहुँच छ।',
    adm_add_admin: '🔐 नयाँ प्रशासक खाता थप्नुहोस्',
    adm_current_admins: 'हालका प्रशासकहरू',
    adm_you: 'तपाईं (मेटाउन मिल्दैन)',
    adm_messages_title: '💬 सम्पर्क सन्देशहरू',
    adm_unread: 'नपढेको',
    col_title: 'शीर्षक', col_category: 'वर्ग', col_date: 'मिति',
    col_status: 'अवस्था', col_actions: 'कार्यहरू', col_location: 'स्थान',
    col_author: 'लेखक', col_icon: 'चिह्न', col_issued: 'जारी गर्ने',
    col_year: 'वर्ष', col_name: 'नाम', col_email: 'इमेल',
    col_position: 'पद', col_jersey: 'जर्सी', col_since: 'देखि',
    col_created: 'सिर्जना मिति', col_subject: 'विषय', col_message: 'सन्देश',
    no_data: 'कुनै डेटा फेला परेन', add_new: '+ नयाँ',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('fyc_lang') || 'en');
  const toggleLang = () => {
    const next = lang === 'en' ? 'np' : 'en';
    setLang(next);
    localStorage.setItem('fyc_lang', next);
  };
  const t = (key) => translations[lang][key] ?? translations['en'][key] ?? key;
  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
