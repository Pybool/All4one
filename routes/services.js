const servicesDetails = [
  {
    id: "neurological",
    title: "Neurological",
    description: `The services provided at our facility are tailored to the care
        and rehabilitation of people with a wide range of
        neuro-disabilities and neurological conditions, challenging
        behaviours and people with learning disabilities. Disease or
        injury to the brain or nervous system, which falls under the
        umbrella term of "neuro-disability," can have varying degrees
        of severity and progress at varying rates of impact on each
        individual. As a result, we adopt a person-centered approach
        to our work, which means we work closely with the individuals
        we are assisting, as well as their loved ones and healthcare
        providers, to tailor our services to each individual's need
        and ensure that they are supported via meaningful activities.
        We help people transition from health institutions to our care
        settings as we also provide long-term care for those with
        life-limiting conditions.`,
  },
  {
    id: "dementia",
    title: "Dementia",
    description: `There are many distinct types of dementia, each of which can
        cause a unique set of symptoms and can take a variety of tolls
        on its victims over time. The impacts of dementia on a
        person's physical, emotional, and mental well-being can have
        far-reaching ramifications for all aspects of day-to-day
        living and can have a profound impact on a person's quality of
        life. <br> <br>The many types of dementia, each of which can cause its
        sufferers to experience a specific set of symptoms and
        ultimately manifest itself in a particular way throughout
        time, The effects that it has on a person's physical,
        emotional, and mental health can have far-reaching
        repercussions for all aspects of day-to-day life and can have
        a domino effect. <br> <br> When it comes to providing assistance and
        services to those who are coping with dementia, we at All4One
        Care Services use a person-centered approach. Our care plan is
        intended to satisfy all of the requirements, and it does so in
        a way that recognizes and honors the importance of persons.
        Our facility has been designed and adapted to accommodate the
        specific requirements of those with dementia, and they offer
        dementia-friendly environments that can aid in the management
        of symptoms like stress and anxiety while preserving the
        residents' dignity, privacy and respect. At the same time, we
        put a strong emphasis on maximizing our users' level of
        freedom so that they may lead happy and productive lives.`,
  },
  {
    id: "parkinson",
    title: "Parkinson’s Disease",
    description: `The degenerative neurological condition known as Parkinson's disease is irreversible and untreatable. It is brought on by the progressive malfunction and death of brain cells.

        Parkinson's disease is characterized by the loss of many nerve cells, including those important for dopamine synthesis. Consequently, patients with Parkinson's disease are typically deficient in this chemical.
        
        Parkinson's disease is often characterized by tremors, stiffness, and a slowing of movement. The progression of the disease may differ from individual to individual, but these symptoms are relatively constant. It is possible for individuals to encounter difficulties with their ability to sleep, their memory, and their mental health as the disease develops.
        <br> <br>
        As a result of the fact that Parkinson's disease symptoms can vary significantly across individuals, we tailor our services to each customer we serve.
        
        We collaborate with them, their loved ones, and other healthcare professionals to develop a care plan that is individually customized to their requirements and complemented with pleasurable daily activities. By doing so, we help users in regaining or maintaining their functional independence, therefore enhancing the quality of life for those who utilize our services.`,
  },
  {
    id: "brain-stroke",
    title: "Brain Injury and Stroke",
    description: `The chance of suffering a stroke or other form of brain damage increases with age. We help people who have suffered brain damage as a result of things like car accidents, strokes, lack of oxygen (anoxic/hypoxic injuries), or even diseases like meningitis.

        The chance of suffering a stroke or other form of brain damage increases with age. We help people who have suffered brain damage as a result of things like car accidents, strokes, lack of oxygen (anoxic/hypoxic injuries), or even diseases like meningitis.
        <br> <br>
        We stick to our person-centered approach, which means we collaborate with the people we're helping to develop a strategy for meeting their specific needs, whether they're trying to recover fully from a brain injury or stroke or are simply hoping to maintain as much of their previous level of functioning as possible.
        
        This method provides people with neurological impairments with the motivation, information, and support they need to heal and resume independent living. We are here to help folks who need to relearn how to do things like cooking, cleaning, and doing laundry feel encouraged and supported in their efforts. Therapeutic, recreational, social, and community-based activities that aid in maintaining or regaining autonomy are strongly encouraged.`,
  },
  {
    id: "spinal-stroke",
    title: "Spinal Injury and Stroke",
    description: `A spinal injury can happen to anyone and at any age. Our services are available to those who have suffered a spinal cord injury as a result of an accident, disease, or degeneration (such as a tumour, a blood clot or a haemorrhage).
        Following a spinal injury, the wounded person and their loved ones will need to make significant changes to their physical, mental, and social life.
        
        Our staff provides care for people with a broad variety of complex care and medical needs as a result of their spinal injury. Assisting factors include:
        `,
    subItems: [
      "Continence management",
      "Physiotherapy",
      "Nutrition and fluid intake",
      "Pressure sore and skin management",
      "Chronic pain management",
      "Tracheostomy care",
      "Ventilation",
    ],
    extra:
      "By encouraging freedom in thought and action and providing opportunities for personal development, our services aim to help each person realise his or her greatest potential.",
  },

  {
    id: "end-life",
    title: "End Of Life",
    description: `When a service user is at the end of life and unable to care for themselves at home or in a hospital, we make sure they are as comfortable as possible, that their wishes are carried out, and that they die with the utmost respect and honour. To ensure that both the dying person and their loved ones feel loved and supported in their final days, we tailor our compassionate end-of-life care to their specific need.
    <br> <br>
            We work with general practitioners and local palliative care teams, among others, to offer the all-encompassing care that every service user deserves and to make the transition to our care facility as gentle and dignified as possible.
            
            Service users with terminal illnesses have the option of receiving palliative care from us. It's important to treat the full person, not just their physical health, which is why we pay attention to their emotional, social, and spiritual wellbeing as well.
            
            Our competent and trained staff provide palliative and end-of-life care to patients with a wide range of diagnoses, including severe stages of dementia, Parkinson's disease, and brain damage.

            Our approach to end of life comprises of the following:
        `,
    subItems: [
      "Spiritual, emotional, and psychological support",
      "Treatment of somatic symptoms like pain",
      "Help with daily activities like bathing, dressing, and eating",
      "Clinical and medical care",
      "Support for close relatives and friends.",
    ],
    extra:
      "We take the time to get to know each user and honour their individual beliefs, objectives, and preferences so that they may feel that they are in charge of their treatment and are never second-guessed.",
    topBreak: true,
  },
  {
    id: "learning-disabled",
    title: "Learning Disability",
    description: `A person with a learning impairment has difficulty learning new material and maintaining their knowledge, as well as communicating and building connections with others.

        If a person with a learning disability cannot meet their own care requirements, either at home or with the aid of family and friends, our services may be a good fit.
        
        After moving into a supported living care facility, those with learning disabilities have access to the same personal care and housekeeping support as individuals who do not have a condition of this kind. In addition to a safe setting, each person's needs, interests, and goals are taken into account while formulating a plan of care.
        <br> <br>
        Individuals can take part in a variety of programs designed to help them learn and grow in a variety of areas, including the workforce, socially, academically, and in terms of being trained to become as independent as possible.
        
        A home care worker may be able to offer the essentials, such as personal care and companionship, to a person with mild to severe learning difficulties. Someone with severe learning problems may have trouble walking, talking, hearing, and even swallowing. Care for persons with profound and numerous impairments will be stratified differently from that for those with mild, moderate, or severe learning difficulties.
        
        High-needs service users may require help with even the most fundamental of daily tasks including eating, bathing, and using the restroom.`,
    topBreak: true,
  },
  {
    id: "respite",
    title: "Respite",
    description: `People who are looked for by friends and family often stay at care facility for shorter periods of time. This might be a prearranged stay while their regular caretaker is away on vacation, or an unanticipated stay due to a crisis. As the caretaker gets some much-needed rest and relaxation, the care recipient might benefit from engaging in positive social interactions with new individuals in an unfamiliar environment.`,
  },
  {
    id: "convalescent",
    title: "Convalescent Care",
    description: `A brief stay at our facility following medical treatment for an injury, illness, or surgery is considered recuperative care. Medications, occupational therapy, physical therapy, counselling, and rest all play a role in the recovery process made possible by convalescent care.`,
  },
  {
    id: "discharges",
    title: "Hospital Discharges",
    description: `A brief stay at our facility following medical treatment for an injury, illness, or surgery is considered recuperative care. Medications, occupational therapy, physical therapy, counselling, and rest all play a role in the recovery process made possible by convalescent care.

                 Otherwise, we are already working closely with the health care professionals in regard to planned discharges. Our aim is to make sure that our incoming service users enjoy a healthy transition thus avoiding any kind of unnecessary stress. Their family members will be part of the process so that they are reassured of the safety of their loved ones.`,
  },

  {
    id: "concerned",
    title: "Behaviours of Concern",
    description: `Providing care in a safe setting for those with numerous health concerns is frequently challenging.

                Our care setting specialises in caring for people with behaviours of concern in an effective way.
                
                Multiple factors, including brain damage or mental illness, can contribute to concerning behaviours.
                
                The challenging behaviour may be due to the following conditions:
        `,
    subItems: [
      "Dementia",
      "Inherited illnesses or disabilities, like autism, can affect a person from birth.",
      "A mental health condition, such as depression, bipolar disorder, schizophrenia or personality disorders",
      "A dysfunction of the brain caused by anything like a blow to the head, a tumour, bleeding, or infection",
      "Stroke",
    ],
    extra: `Learning effective methods of dealing with stressful situations and controlling one's emotions requires the guidance of a skilled specialist.
            Our trained staff members work hand in hand with service users in identifying and avoiding possible behavioural triggers while also instructing them on how to cope with the negative impacts of being exposed to them.
            <br> <br>
            Before considering any other options, we investigate psychological strategies for diverting attention.
            To help people live fulfilling lives and fully engage in society without being held back by their behaviour, our approach to supporting positive behaviour focuses on minimizing the occurrence and severity of negative manners. Through individualised, flexible, and user-friendly engagement, we help our customers gain trust and speed up the adoption of effective treatment plans. Users with behavioural issues might benefit greatly from careful preparation and participation in purposeful activities.`,
    topBreak: true,
  },
];

const team = [
  {
    id: 0,
    name: "Taye Oyelekan",
    position: "Founder",
    about1:
      "I am Taye Oyelekan, a passionate leader dedicated to enhancing the quality of life for our residents at every turn. With years of experience in senior care management, I am committed to fostering a nurturing environment where compassion and excellence thrive.",
    about2:
      "Originally from United Kingdom, I earned my Degree from London University, equipping me with the knowledge and skills necessary to lead our team with confidence and integrity. Together, we strive to exceed expectations and make a positive impact in the lives of those we serve.",
    address: "123 Main Street, Suite 100, London, SE1 1AB, United Kingdom",
    email: "tayeoyelekan@yahoo.com",
    phone: "+44 20 1234 5678",
    facebook: "",
    twitter: "",
    youtube: "",
    imageUrl: "/assets/img/team/ceo_thumb.jpg",
  },
  {
    id: 1,
    name: "taye oyelekanS",
    position: "Volunteer (Senior Caregiver)",
    about1: `I am taye oyelekanS, a dedicated professional with a passion for caring for those with special needs and the elderly. Over the past 5 years, I have cultivated a diverse skill set and accumulated invaluable experience in special needs and elderly health care.`,
    about2: `Originally hailing from United Kingdom, I pursued my education in [Degree or Qualification] at [University Name] in the UK. During my time at university, I immersed myself in [relevant subjects or areas of study] and actively participated in extracurricular activities such as [mention any relevant activities or clubs]. This academic journey not only honed my intellectual capabilities but also instilled in me a passion for lifelong learning.`,
    address: `123 High Street, Flat 4, London, SE1 2AB, United Kingdom`,
    email: `rosalinawill@gmail.com`,
    phone: `+44 20 1234 5678`,
    facebook: ``,
    twitter: ``,
    youtube: ``,
    imageUrl: `/assets/img/team/team_thumb04.jpg`,
  },
  {
    id: 2,
    name: "John Doe",
    position: "Volunteer (Senior Caregiver)",
    about1:
      "I am John Doe, a compassionate and experienced senior caregiver dedicated to providing quality care and support to elderly individuals. With over a decade of experience in the field, I have developed a deep understanding of the unique needs and challenges faced by seniors, and I am committed to ensuring their well-being and comfort.",
    about2:
      "Originally from [Country], I received my formal training in elderly care from [Institution Name] and have since worked in various settings, including assisted living facilities and private residences. My passion for caregiving stems from a desire to make a positive difference in the lives of others, and I approach each day with empathy, patience, and respect.",
    address: "456 Oak Street, Apartment 3B, Manchester, M1 1AB, United Kingdom",
    email: "johndoe@example.com",
    phone: "+44 20 9876 5432",
    facebook: "https://www.facebook.com/all4onecare",
    twitter: "https://twitter.com/johndoe",
    youtube: "",
    imageUrl: `/assets/img/team/team_thumb05.jpg`,
  },
  {
    id: 3,
    name: "Emily Smith",
    position: "Volunteer (Special Needs Educator)",
    about1:
      "I am Emily Smith, a dedicated special needs educator passionate about creating inclusive learning environments where every child can thrive. With a background in special education and child development, I bring a wealth of knowledge and experience to my role, ensuring that each student receives the support and guidance they need to reach their full potential.",
    about2:
      "Originally from [Country], I completed my training in special education at [Institution Name] before relocating to the UK to pursue my career. I believe in the power of education to transform lives, and I am committed to advocating for the rights and needs of individuals with special needs, both inside and outside the classroom.",
    address: "789 Maple Avenue, Unit 5, Birmingham, B2 2CD, United Kingdom",
    email: "emilysmith@example.com",
    phone: "+44 20 5555 1234",
    facebook: "",
    twitter: "",
    youtube: "",
    imageUrl: `/assets/img/team/team_thumb06.jpg`,
  },
  {
    id: 4,
    name: "David Johnson",
    position: "Geriatric Nurse",
    about1:
      "I am David Johnson, a dedicated geriatric nurse with a passion for providing compassionate and comprehensive care to elderly patients. With a background in nursing and a focus on gerontology, I am committed to promoting the health, dignity, and well-being of older adults.",
    about2:
      "Originally from [Country], I obtained my nursing degree from [Institution Name] and have since specialized in geriatric care. I have extensive experience working in hospitals, nursing homes, and community settings, where I have had the privilege of caring for individuals with a wide range of health conditions.",
    address: "10 Elm Street, Apartment 2C, Leeds, LS1 1XY, United Kingdom",
    email: "davidjohnson@example.com",
    phone: "+44 20 1111 2222",
    facebook: "",
    twitter: "",
    youtube: "",
    imageUrl: `/assets/img/team/team_thumb07.jpg`,
  },
  {
    id: 5,
    name: "Sarah Brown",
    position: "Occupational Therapist",
    about1:
      "I am Sarah Brown, a dedicated occupational therapist committed to helping individuals of all ages overcome physical, cognitive, and emotional challenges to lead fulfilling lives. With a passion for empowering others and a strong background in rehabilitation, I strive to make a positive impact on the lives of my clients.",
    about2:
      "Originally from [Country], I completed my education in occupational therapy at [Institution Name] before embarking on my career in the UK. I have worked in diverse settings, including hospitals, schools, and community centers, where I have had the privilege of supporting individuals with a wide range of conditions and disabilities.",
    address: "15 Pine Street, Apartment 1A, Glasgow, G1 3AB, United Kingdom",
    email: "sarahbrown@example.com",
    phone: "+44 20 3333 4444",
    facebook: "",
    twitter: "",
    youtube: "",
    imageUrl: `/assets/img/team/team_thumb08.jpg`,
  },
  {
    id: 6,
    name: "Michael Wilson",
    position: "Social Worker",
    about1:
      "I am Michael Wilson, a compassionate and dedicated social worker committed to advocating for the rights and well-being of vulnerable individuals and families. With a background in social work and a deep understanding of community resources, I strive to empower those in need and facilitate positive change.",
    about2:
      "Originally from [Country], I received my social work training at [Institution Name] before beginning my career in the UK. I have experience working with diverse populations, including children, adults, and older adults, and I am skilled in providing support and intervention in a variety of challenging situations.",
    address: "20 Birch Avenue, Apartment 4D, Bristol, BS1 4EF, United Kingdom",
    email: "michaelwilson@example.com",
    phone: "+44 20 7777 8888",
    facebook: "",
    twitter: "",
    youtube: "",
    imageUrl: `/assets/img/team/team_thumb09.jpg`,
  },
];

const getTeamMemberById = (id) => {
  return team.find((item) => item.id === id);
};

const data = { servicesDetails, team, getTeamMemberById };

module.exports = data;
