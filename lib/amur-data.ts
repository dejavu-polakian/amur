import type { LucideIcon } from "lucide-react";
import {
  Bike,
  BookOpen,
  Briefcase,
  Camera,
  Coffee,
  Dumbbell,
  Film,
  GraduationCap,
  Heart,
  MapPin,
  Mountain,
  Music,
  Palette,
  Plane,
  Ruler,
  Sailboat,
  Utensils,
  Wine,
  Wine as WineIcon,
} from "lucide-react";

export type Message =
  | {
      id: string;
      kind: "text";
      from: "me" | "them";
      text: string;
      time: string;
      status?: "sent" | "delivered" | "read";
    }
  | {
      id: string;
      kind: "image";
      from: "me" | "them";
      src: string;
      caption?: string;
      time: string;
      status?: "sent" | "delivered" | "read";
    }
  | {
      id: string;
      kind: "system";
      text: string;
    };

/** One strictly ordered step of a scripted conversation. */
export type ScriptStep =
  | { kind: "text"; from: "me" | "them"; text: string }
  | { kind: "image"; from: "me" | "them"; src: string; caption?: string };

export type Fact = { icon: LucideIcon; label: string };
export type Interest = { label: string; icon: LucideIcon };

export type Conversation = {
  id: string;
  name: string;
  /** Dative form of the name, used in the chat composer placeholder
   *  ("Напишите {nameDative}…"). Russian name declensions are irregular
   *  (Данила → Даниле, Лев → Льву), so each name keeps its own form. */
  nameDative: string;
  age: number;
  avatar: string;
  photos: string[];
  online: boolean;
  status: string;
  verified: boolean;
  city: string;
  distance: string;
  compatibility: number;
  about: string;
  facts: Fact[];
  interests: Interest[];
  matchedLabel: string;
  preview: {
    lastMessage: string;
    time: string;
    unread?: number;
    fromMe?: boolean;
  };
  suggestion: string;
  /** Full scripted dialog. Every scenario starts with `from: "them"`. */
  script: ScriptStep[];
};

/** Matches shown in the "Новые совпадения" strip */
export const newMatches = [
  { id: "n1", name: "Лиза", avatar: "/profiles/match-1.jpg", isNew: true },
  { id: "n2", name: "Марк", avatar: "/profiles/match-4.jpg", isNew: true },
  { id: "n3", name: "Игорь", avatar: "/profiles/match-5.jpg" },
];

export const conversations: Conversation[] = [
  {
    id: "c1",
    name: "Артём",
    nameDative: "Артёму",
    age: 31,
    avatar: "/profiles/artem-main.jpg",
    photos: ["/profiles/artem-main.jpg", "/profiles/artem-2.jpg", "/profiles/artem-3.jpg"],
    online: true,
    status: "В сети · отвечает обычно в течение часа",
    verified: true,
    city: "Москва, Патриаршие",
    distance: "3 км",
    compatibility: 96,
    about:
      "Проектирую дома, в которых хочется остаться на завтрак. По субботам играю на саксофоне в «Бродском», по воскресеньям — молчу. Ищу того, с кем интересно молчать не меньше, чем говорить.",
    facts: [
      { icon: Briefcase, label: "Архитектор, бюро «Мел»" },
      { icon: GraduationCap, label: "МАРХИ" },
      { icon: MapPin, label: "Москва · 3 км от вас" },
      { icon: Ruler, label: "186 см" },
      { icon: Wine, label: "Пьёт иногда" },
    ],
    interests: [
      { label: "Джаз", icon: Music },
      { label: "Скалолазание", icon: Mountain },
      { label: "Литература", icon: BookOpen },
      { label: "Фильтр-кофе", icon: Coffee },
    ],
    matchedLabel: "Вы совпали сегодня",
    preview: {
      lastMessage: "Новое совпадение — он пишет первым",
      time: "только что",
      unread: 1,
    },
    suggestion: "С радостью — в 19:00 идеально",
    script: [
      {
        kind: "text",
        from: "them",
        text: "Привет, Аня. У тебя в профиле фото с Грушинского — редкое дело. Сама играешь или просто гостила?",
      },
      {
        kind: "text",
        from: "me",
        text: "Привет) Играю, но редко на публику.\nВ основном для себя и двух котов.",
      },
      {
        kind: "text",
        from: "them",
        text: "Коты — самая строгая аудитория. Меня в детстве отправили в музыкалку, выжил только саксофон.",
      },
      {
        kind: "image",
        from: "them",
        src: "/profiles/artem-2.jpg",
        caption: "Вот, кстати, доказательство — сегодня утром в «Кооперативе».",
      },
      {
        kind: "text",
        from: "me",
        text: "Хорошее место. Я туда хожу за фильтр-кофе и тишиной до полудня.",
      },
      {
        kind: "text",
        from: "them",
        text: "Значит, у нас уже есть общее место. Предлагаю добавить ещё одно — «Бродский» в субботу вечером. Там джем-сейшн, я играю первый сет.",
      },
      {
        kind: "text",
        from: "me",
        text: "Звучит как план, от которого сложно отказаться.",
      },
      {
        kind: "text",
        from: "them",
        text: "Тогда в субботу в 19:00 у «Бродского»? Заберу столик у окна.",
      },
      {
        kind: "text",
        from: "me",
        text: "С радостью — в 19:00 идеально.",
      },
      {
        kind: "text",
        from: "them",
        text: "Отлично. Напишу с утра, подтвержу, что всё в силе. И, Ань, — рад, что мы совпали.",
      },
    ],
  },
  {
    id: "c2",
    name: "Данила",
    nameDative: "Даниле",
    age: 29,
    avatar: "/profiles/match-1.jpg",
    photos: ["/profiles/match-1.jpg", "/profiles/match-4.jpg"],
    online: true,
    status: "В сети",
    verified: true,
    city: "Москва, Арбат",
    distance: "5 км",
    compatibility: 88,
    about:
      "Собираю винил, варю эспрессо, иногда дирижирую хором любителей. Ценю людей, которые не боятся молчаливых пауз и странных шуток.",
    facts: [
      { icon: Briefcase, label: "Саунд-дизайнер" },
      { icon: GraduationCap, label: "Гнесинка" },
      { icon: MapPin, label: "Арбат · 5 км" },
      { icon: Ruler, label: "181 см" },
    ],
    interests: [
      { label: "Винил", icon: Music },
      { label: "Кино", icon: Film },
      { label: "Галереи", icon: Palette },
      { label: "Вино", icon: WineIcon },
    ],
    matchedLabel: "Вы совпали 5 дней назад",
    preview: {
      lastMessage: "Посмотрите анкету",
      time: "2 часа назад",
    },
    suggestion: "Обожаю Coltrane — как ты догадался?",
    script: [
      {
        kind: "text",
        from: "them",
        text: "У тебя в плейлисте Coltrane соседствует с Björk — я сдаюсь, это попадание.",
      },
      {
        kind: "text",
        from: "them",
        text: "И, кстати, отличный вкус в музыке.",
      },
      {
        kind: "text",
        from: "me",
        text: "Обожаю Coltrane — как ты догадался?",
      },
      {
        kind: "text",
        from: "them",
        text: "По сторис три недели назад. Я не преследователь, просто внимательный.",
      },
      {
        kind: "text",
        from: "me",
        text: "Переживу)",
      },
      {
        kind: "text",
        from: "them",
        text: "В четверг в баре на Чистых открытие — винил, жареный баклажан, мой сет после одиннадцати.",
      },
      {
        kind: "text",
        from: "me",
        text: "Я за. Во сколько лучше приходить?",
      },
      {
        kind: "text",
        from: "them",
        text: "К десяти — как раз успеем поужинать. Я буду в синей рубашке и с пластинкой подмышкой.",
      },
    ],
  },
  {
    id: "c3",
    name: "Михаил",
    nameDative: "Михаилу",
    age: 34,
    avatar: "/profiles/match-2.jpg",
    photos: ["/profiles/match-2.jpg", "/profiles/match-3.jpg"],
    online: false,
    status: "Был в сети час назад",
    verified: true,
    city: "Москва, Замоскворечье",
    distance: "7 км",
    compatibility: 82,
    about: "Финансовый директор днём, домашний повар вечером. Люблю длинные ужины и короткие сообщения.",
    facts: [
      { icon: Briefcase, label: "CFO, fintech" },
      { icon: GraduationCap, label: "ВШЭ" },
      { icon: MapPin, label: "Замоскворечье · 7 км" },
      { icon: Ruler, label: "184 см" },
      { icon: Wine, label: "Красное, сухое" },
    ],
    interests: [
      { label: "Кулинария", icon: Utensils },
      { label: "Вино", icon: WineIcon },
      { label: "Путешествия", icon: Plane },
    ],
    matchedLabel: "Вы совпали неделю назад",
    preview: {
      lastMessage: "Посмотрите анкету",
      time: "вчера",
    },
    suggestion: "Пятница, 19:30 — «Угли»",
    script: [
      {
        kind: "text",
        from: "them",
        text: "Какой любимый ужин по будням?",
      },
      {
        kind: "text",
        from: "me",
        text: "Расскажу при встрече)",
      },
      {
        kind: "text",
        from: "them",
        text: "Принимается. Я люблю такую стратегию.",
      },
      {
        kind: "text",
        from: "them",
        text: "Я свободен в пятницу после шести. Что скажешь?",
      },
      {
        kind: "text",
        from: "me",
        text: "Пятница подходит.",
      },
      {
        kind: "text",
        from: "them",
        text: "Могу забронировать «Угли» или «Zodiac» — что ближе по настроению?",
      },
      {
        kind: "text",
        from: "me",
        text: "Давай «Угли», я там ещё не была.",
      },
      {
        kind: "text",
        from: "them",
        text: "Договорились. В 19:30 буду за столиком на имя Михаил. И захвачу бутылку Кьянти 2018 — попробуешь.",
      },
    ],
  },
  {
    id: "c4",
    name: "Кирилл",
    nameDative: "Кириллу",
    age: 30,
    avatar: "/profiles/match-3.jpg",
    photos: ["/profiles/match-3.jpg", "/profiles/match-5.jpg"],
    online: false,
    status: "Был в сети вчера",
    verified: false,
    city: "Москва, Сокольники",
    distance: "9 км",
    compatibility: 79,
    about: "Фотографирую людей в горах и города на рассвете. Скорее сова, чем жаворонок, но ради тебя — как получится.",
    facts: [
      { icon: Briefcase, label: "Фотограф" },
      { icon: GraduationCap, label: "Британка" },
      { icon: MapPin, label: "Сокольники · 9 км" },
      { icon: Ruler, label: "180 см" },
    ],
    interests: [
      { label: "Фото", icon: Camera },
      { label: "Горы", icon: Mountain },
      { label: "Путешествия", icon: Plane },
    ],
    matchedLabel: "Вы совпали 10 дней назад",
    preview: {
      lastMessage: "Новое совпадение",
      time: "вчера",
    },
    suggestion: "Тбилиси в апреле — это мечта",
    script: [
      {
        kind: "text",
        from: "them",
        text: "Вижу, ты упоминала Грузию — бывала в последний год?",
      },
      {
        kind: "text",
        from: "them",
        text: "Я был в Тбилиси в прошлом году.",
      },
      {
        kind: "text",
        from: "me",
        text: "Была два года назад, влюбилась.",
      },
      {
        kind: "text",
        from: "them",
        text: "В Тбилиси лучший хинкальный — «Захар Захарыч», записывай.",
      },
      {
        kind: "text",
        from: "them",
        text: "Я туда возвращаюсь каждую весну на пару недель.",
      },
      {
        kind: "text",
        from: "me",
        text: "Завидую. У меня апрель — сплошные дедлайны.",
      },
      {
        kind: "text",
        from: "them",
        text: "А что, если составишь компанию в следующий раз? Полушутя, но всерьёз.",
      },
      {
        kind: "text",
        from: "me",
        text: "Подумаю над этим серьёзно.",
      },
    ],
  },
  {
    id: "c5",
    name: "Андрей",
    nameDative: "Андрею",
    age: 28,
    avatar: "/profiles/match-4.jpg",
    photos: ["/profiles/match-4.jpg", "/profiles/match-1.jpg"],
    online: true,
    status: "В сети",
    verified: true,
    city: "Москва, Хамовники",
    distance: "4 км",
    compatibility: 91,
    about:
      "Бегаю по утрам, готовлю по вечерам, читаю ночью. Ищу человека, с которым можно разделить всё три и ещё что-нибудь.",
    facts: [
      { icon: Briefcase, label: "Product-дизайнер" },
      { icon: MapPin, label: "Хамовники · 4 км" },
      { icon: Ruler, label: "178 см" },
      { icon: Wine, label: "Не пьёт" },
    ],
    interests: [
      { label: "Бег", icon: Dumbbell },
      { label: "Вело", icon: Bike },
      { label: "Кулинария", icon: Utensils },
    ],
    matchedLabel: "Вы совпали 2 недели назад",
    preview: {
      lastMessage: "Посмотрите анкету",
      time: "пн",
    },
    suggestion: "Суббота в семь — отличная идея",
    script: [
      {
        kind: "text",
        from: "them",
        text: "Привет) Видел твою пробежку по Strava вдоль Москвы-реки — 6:15 на пятёрке, внушает.",
      },
      {
        kind: "text",
        from: "me",
        text: "Ха, ты подписан? Я не заметила.",
      },
      {
        kind: "text",
        from: "them",
        text: "Подписался вчера, чтобы сделать первый шаг нестандартно.",
      },
      {
        kind: "text",
        from: "them",
        text: "Суббота, вечер, прогулка по Хамовникам — как идея?",
      },
      {
        kind: "text",
        from: "me",
        text: "С удовольствием)",
      },
      {
        kind: "text",
        from: "them",
        text: "Тогда заберу нас в семь у метро «Парк Культуры». Обещаю не опаздывать.",
      },
      {
        kind: "text",
        from: "me",
        text: "Буду ждать ровно в семь.",
      },
      {
        kind: "text",
        from: "them",
        text: "И принесу термос с мятой — вечер обещает быть свежим.",
      },
    ],
  },
  {
    id: "c6",
    name: "Лев",
    nameDative: "Льву",
    age: 33,
    avatar: "/profiles/match-5.jpg",
    photos: ["/profiles/match-5.jpg", "/profiles/match-2.jpg"],
    online: false,
    status: "Был в сети утром",
    verified: true,
    city: "Санкт-Петербург",
    distance: "640 км",
    compatibility: 86,
    about: "Пишу прозу в стол и в журналы, в Москве бываю раз в месяц. Лучшее из того, что умею — слушать.",
    facts: [
      { icon: Briefcase, label: "Редактор" },
      { icon: GraduationCap, label: "СПбГУ, филология" },
      { icon: MapPin, label: "Санкт-Петербург" },
      { icon: Ruler, label: "183 см" },
    ],
    interests: [
      { label: "Литература", icon: BookOpen },
      { label: "Парусник", icon: Sailboat },
      { label: "Вино", icon: WineIcon },
      { label: "Кино", icon: Film },
    ],
    matchedLabel: "Вы совпали месяц назад",
    preview: {
      lastMessage: "Посмотрите анкету",
      time: "вс",
    },
    suggestion: "Позвони, когда будешь свободен",
    script: [
      {
        kind: "text",
        from: "them",
        text: "Доброе утро, Аня. Читаю твою анкету третий день подряд и всё не решаюсь написать.",
      },
      {
        kind: "text",
        from: "me",
        text: "Утро доброе)",
      },
      {
        kind: "text",
        from: "them",
        text: "Как спалось?",
      },
      {
        kind: "text",
        from: "me",
        text: "Долго и странно.",
      },
      {
        kind: "text",
        from: "them",
        text: "Лучшее сочетание. У меня тут дождь за окном, кофе и «Разговоры в трамвае».",
      },
      {
        kind: "text",
        from: "them",
        text: "Если будет настроение — звони, у меня весь день свободен.",
      },
      {
        kind: "text",
        from: "me",
        text: "Тогда позвоню после обеда.",
      },
      {
        kind: "text",
        from: "them",
        text: "Буду ждать. И, кстати, — рад был получить от тебя эти строчки.",
      },
    ],
  },
];

/** "Heart" icon re-export so the chat view can decorate suggestion chips */
export { Heart as SuggestionIcon };
