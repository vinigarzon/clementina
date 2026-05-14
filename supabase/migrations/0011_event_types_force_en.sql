-- =====================================================================
-- Finca La Clementina · Migración 0011
-- SOBREESCRIBE forzadamente los campos *_en de event_types con
-- traducciones limpias en inglés.
--
-- Necesaria porque algunos tipos de evento tenían los campos _en
-- llenos con texto en español (no nulos, no vacíos), así que la
-- migración 0010 los respetó y no aplicó las traducciones.
--
-- ⚠️ Esta migración SÍ sobrescribe. Si tienes una traducción inglesa
-- mejor escrita a mano, hazle backup antes de ejecutar.
-- =====================================================================

update public.event_types set
  title_en       = 'Weddings',
  short_en       = 'Ceremonies and receptions in a natural, elegant and family setting.',
  description_en = 'Your wedding at Finca La Clementina can have an outdoor ceremony at the pergola, photos by the lake, an elegant reception in the hall or under marquees, dinner, toast, cake, music and a celebration as you''ve always imagined it.',
  highlights_en  = ARRAY[
    'Ceremony at the open-air pergola',
    'Bride entrance and special couple entrance',
    'Photo session by the lake, bridge and gardens',
    'Reception in the main hall or under marquees',
    'Dinner, toast, cake and sweet table',
    'Live music, DJ, highlight hour or live show',
    'Coordination and event production'
  ],
  body_en = '<h2>The experience at La Clementina</h2><p>From the moment guests arrive, every detail is designed so the couple only thinks about enjoying. The natural setting, the spacious areas and the warm staff make the day flow with calm and excitement.</p><h2>Ideas to enrich your wedding</h2><ul><li>Outdoor ceremony at the pergola.</li><li>Photo route by the lake and gardens.</li><li>Cocktail reception in the green areas.</li><li>Reception under marquees with extra capacity.</li></ul>',
  whatsapp_message_en = 'Hi, I''d like information about weddings at Finca La Clementina.'
where slug = 'bodas';

update public.event_types set
  title_en       = 'Sweet Fifteen',
  short_en       = 'A new stage celebrated with magic, music and unique details.',
  description_en = 'A sweet fifteen at La Clementina combines family tradition with the most modern and fun side: special entrance, choreography, photo session, themed decoration and a memorable party.',
  highlights_en  = ARRAY[
    'Special entrance of the quinceañera',
    'Waltz with dad, family or chambelanes',
    'Photo session before or during the event',
    'Head table, cake and themed sweet table',
    'Decoration with flowers, balloons, lights and family-chosen style',
    'DJ, highlight hour, modern dance or surprise show',
    'Moment for words from parents, godparents or grandparents'
  ],
  body_en = '<h2>The experience</h2><p>At La Clementina, this celebration can include a special entrance, photo session, head table, themed decoration, music, dance, cake and family moments. The natural environment makes every photo feel different and gives the party an elegant, fresh and memorable air.</p><h2>Ideas to enrich the experience</h2><ul><li>Create a "photo walk" through the venue for shots with the dress, family and friends.</li><li>Design a red-carpet style or lit-path entrance for the quinceañera.</li><li>Set up a wishes table where guests write messages for the new stage.</li><li>Build a photo corner with friends, balloons, lights, flowers or a personalized sign.</li><li>Combine an elegant family meal with a youth party after the toast.</li></ul><h2>Connection with Tulcán and Carchi</h2><p>The quinceañera celebration in Carchi has a lot of family, pride and togetherness. La Clementina lets you honor parents and godparents while giving the quinceañera a modern, visual and fun celebration.</p><h2>Food and details</h2><ul><li>Youth and family menu, with options for adults and young guests.</li><li>Sweet table with themed cake, cupcakes, appetizers and desserts.</li><li>Non-alcoholic drinks, mocktail station or hot drinks.</li><li>Appetizers for the reception and the dance hour.</li></ul>',
  whatsapp_message_en = 'Hi, I''d like information about quinceañera parties at Finca La Clementina.'
where slug = 'quince-anos';

update public.event_types set
  title_en       = 'Graduations',
  short_en       = 'The achievement deserves a celebration with those who shared the journey.',
  description_en = 'Graduation parties — school, high school, university — find a perfect setting at La Clementina to gather family, friends and classmates in a relaxed, elegant atmosphere.',
  highlights_en  = ARRAY[
    'Reception with family and friends',
    'Diploma photos by the lake and gardens',
    'Recognition speech moment',
    'Catering, drinks and cake',
    'Music, DJ or social closing',
    'Themed decoration in school colors',
    'Outdoor or indoor option'
  ],
  body_en = '<h2>The graduation experience</h2><p>A space designed so the family can enjoy a celebration with calm: outdoor area for photos, hall for the formal moment and the option of music to close the night.</p><h2>Ideas to enrich the celebration</h2><ul><li>Photo corner with the gown and diploma by the lake.</li><li>Recognition wall for family who supported the journey.</li><li>Sweet table with themed cake.</li><li>Live music or DJ for the dance part.</li></ul>',
  whatsapp_message_en = 'Hi, I''d like information about graduation parties at Finca La Clementina.'
where slug = 'graduaciones';

update public.event_types set
  title_en       = 'Corporate Events',
  short_en       = 'Meetings, launches and corporate celebrations in a different setting.',
  description_en = 'Conventions, team meetings, year-end parties, recognitions, product launches or strategy sessions: La Clementina offers a professional yet warm environment outside the city noise.',
  highlights_en  = ARRAY[
    'Meeting hall with audiovisual setup',
    'Coffee break, lunch or full catering',
    'Outdoor areas for team activities',
    'Parking for around 100 cars',
    'Backup power generator',
    'Optional photo and video coverage',
    'Wi-Fi and presentation equipment'
  ],
  body_en = '<h2>Why La Clementina for your corporate event</h2><p>Different setting, easy logistics and a team that handles every detail so you only focus on the agenda. Useful for offsites, year-end parties, team building, supplier meetings and product launches.</p><h2>Formats we host</h2><ul><li>Conventions and seminars with up to 500 attendees.</li><li>Team buildings combining outdoor activities and conference room.</li><li>End-of-year parties with cocktail, dinner and entertainment.</li><li>Recognitions and supplier dinners.</li></ul>',
  whatsapp_message_en = 'Hi, I''d like information about corporate events at Finca La Clementina.'
where slug = 'corporativos';

update public.event_types set
  title_en       = 'Baptisms & First Communions',
  short_en       = 'Moments of faith, family and tenderness in a special place.',
  description_en = 'Baptisms, first communions and confirmations celebrated in a warm, natural environment, with family-style catering and elegant decoration.',
  highlights_en  = ARRAY[
    'Family reception with godparents and grandparents',
    'Themed decoration in soft tones',
    'Family menu',
    'Cake, sweet table and appetizers',
    'Photo session in the gardens',
    'Quiet music or live entertainment',
    'Space for children to play'
  ],
  body_en = '<h2>A warm celebration</h2><p>Designed for the family to gather without rush, with space for the little ones to play and for the adults to enjoy a calm meal.</p>',
  whatsapp_message_en = 'Hi, I''d like information about baptisms or communions at Finca La Clementina.'
where slug = 'bautizos-comuniones';

update public.event_types set
  title_en       = 'Baby Shower',
  short_en       = 'A sweet, intimate and joyful welcome.',
  description_en = 'An afternoon to celebrate the upcoming arrival of the baby surrounded by family and close friends, with delicate decoration and a relaxed environment.',
  highlights_en  = ARRAY[
    'Setup in the gardens or in the hall',
    'Themed decoration (boy, girl or neutral)',
    'Sweet table, snacks and natural drinks',
    'Games and activities',
    'Photo session for the mom-to-be',
    'Personalized photo wall',
    'Drinks station'
  ],
  body_en = '<h2>A relaxed welcome</h2><p>The natural setting and the warm hall let the gathering flow with calm. Perfect for groups of 20 to 80 guests.</p>',
  whatsapp_message_en = 'Hi, I''d like information about a baby shower at Finca La Clementina.'
where slug = 'baby-shower';

update public.event_types set
  title_en       = 'Anniversaries',
  short_en       = 'Years that deserve to be celebrated with the family.',
  description_en = 'Wedding anniversaries, family or birthday gatherings — the perfect occasion to bring everyone together in an elegant and meaningful place.',
  highlights_en  = ARRAY[
    'Lunch or dinner with family',
    'Renewal of vows option',
    'Cake, toast and family speeches',
    'Music or live serenade',
    'Photo session in the gardens',
    'Themed decoration',
    'Memorable details for the honorees'
  ],
  body_en = '<h2>A meaningful celebration</h2><p>From intimate dinners for 20 people to gatherings of 200, La Clementina adapts to the scale of the anniversary you want to honor.</p>',
  whatsapp_message_en = 'Hi, I''d like information about anniversary celebrations at Finca La Clementina.'
where slug = 'aniversarios';

update public.event_types set
  title_en       = 'Farewell Parties',
  short_en       = 'A meaningful farewell among close people.',
  description_en = 'Farewell parties — for studies, travel, work or simply a new stage — celebrated in a setting that mixes calm and warmth.',
  highlights_en  = ARRAY[
    'Reception with close family and friends',
    'Themed decoration',
    'Catering and drinks',
    'Music or DJ',
    'Photo or video moment to remember the date',
    'Wishes book',
    'Special memory station'
  ],
  body_en = '<h2>A meaningful farewell</h2><p>Spaces that allow conversation, hugs and dance. The right place to mark an important transition.</p>',
  whatsapp_message_en = 'Hi, I''d like information about a farewell event at Finca La Clementina.'
where slug = 'despedidas';

update public.event_types set
  title_en       = 'Social Gatherings',
  short_en       = 'Friends, family and the joy of being together.',
  description_en = 'Birthdays, reunions, dinners with friends or any excuse to celebrate. La Clementina is also designed for those gatherings that don''t need a big reason.',
  highlights_en  = ARRAY[
    'Spacious areas for groups of any size',
    'Catering and drinks to taste',
    'Music or DJ',
    'Outdoor or indoor option',
    'Easy access and parking',
    'Quick-setup decoration',
    'Photo-friendly corners'
  ],
  body_en = '<h2>A space for any celebration</h2><p>Flexibility, comfort and atmosphere: that''s what defines La Clementina''s social events. Designed so you and your guests only worry about enjoying.</p>',
  whatsapp_message_en = 'Hi, I''d like information about a social event at Finca La Clementina.'
where slug = 'sociales';

notify pgrst, 'reload schema';
