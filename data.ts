
import { Era, Region } from './types';

export const ERAS: Record<string, Era> = {
  'renaissance': { id: 'renaissance', name: '文艺复兴', range: '14-16世纪', color: 'bg-amber-700' },
  '19th_century': { id: '19th_century', name: '19世纪后期', range: '1860-1900', color: 'bg-purple-600' },
  'modern': { id: 'modern', name: '现代艺术', range: '20世纪初', color: 'bg-blue-600' }
};

export const COURSE_DATA: Record<string, Region[]> = {
  '19th_century': [
    {
      id: 'region-fr',
      name: '法国',
      flag: '🇫🇷',
      description: '现代艺术的摇篮',
      schools: [
        {
          id: 'school-impressionism',
          name: '印象派',
          description: '捕捉瞬间的光影变化',
          color: 'bg-purple-500',
          borderColor: 'border-purple-700',
          painters: [
            {
              id: 'painter-monet',
              name: '莫奈',
              nameEn: 'Claude Monet',
              avatar: '🧔🏼‍♂️',
              desc: '印象派之父',
              birthPlace: '法国·巴黎',
              lifespan: '1840 - 1926',
              schoolName: '印象派',
              mascotState: 'waving',
              cardLevel: 3,
              bioEvents: [
                { 
                  year: '1840', 
                  title: '莫奈诞生', 
                  desc: '莫奈出生于巴黎。他在那里结识了欧仁·布丹，并开始学习油画和室外写生。', 
                  image: '👶',
                  imageCaption: '莫奈童年时期的巴黎街头'
                },
                { 
                  year: '1872', 
                  title: '《印象·日出》与印象派', 
                  desc: '他在勒阿弗尔创作了这幅描绘港口晨雾的作品。确立了他的风格。', 
                  image: '🌅',
                  imageCaption: '改变艺术史的《印象·日出》'
                },
                { 
                  year: '1883', 
                  title: '定居吉维尼', 
                  desc: '莫奈搬到了吉维尼。他在这里买下了一处房产，并建造著名的水上花园。', 
                  image: '🏡',
                  imageCaption: '吉维尼花园的日本桥'
                }
              ],
              levels: [
                {
                  id: 'lvl-1',
                  name: '初级',
                  label: '光影初探',
                  status: 'active',
                  lessons: [
                    { id: 101, type: 'lesson', name: '日出·印象', status: 'completed', stars: 3, icon: '🌅', reward: { type: 'painting', name: '日出·印象', nameEn: 'Impression, Sunrise', image: '🌅', year: '1872', location: '巴黎马蒙丹莫奈美术馆', material: '布面油画' } },
                    { id: 102, type: 'lesson', name: '干草堆', status: 'completed', stars: 2, icon: '🌾', reward: { type: 'painting', name: '干草堆', nameEn: 'Haystacks', image: '🌾', year: '1890', location: '芝加哥艺术博物馆', material: '布面油画' } },
                    { id: 104, type: 'lesson', name: '撑阳伞的女人', status: 'completed', stars: 3, icon: '☂️', reward: { type: 'painting', name: '撑阳伞的女人', nameEn: 'Woman with a Parasol', image: '☂️', year: '1875' } },
                    { id: 105, type: 'lesson', name: '圣拉扎尔火车站', status: 'active', stars: 0, icon: '🚂', reward: { type: 'painting', name: '圣拉扎尔火车站', nameEn: 'The Saint-Lazare Station', image: '🚂', year: '1877' } },
                  ]
                }
              ]
            },
            {
              id: 'painter-renoir',
              name: '雷诺阿',
              nameEn: 'Pierre-Auguste Renoir',
              avatar: '👨🏻‍🎨',
              desc: '幸福与甜美',
              mascotState: 'active',
              cardLevel: 2,
              levels: [
                 {
                  id: 'lvl-1',
                  name: '初级',
                  label: '人物与生活',
                  status: 'active',
                  lessons: [
                    { id: 401, type: 'lesson', name: '煎饼磨坊', status: 'completed', stars: 3, icon: '💃', reward: { type: 'painting', name: '煎饼磨坊的舞会', nameEn: 'Bal du moulin de la Galette', image: '💃', year: '1876' } },
                    { id: 402, type: 'lesson', name: '游艇午餐', status: 'active', stars: 0, icon: '🍽️', reward: { type: 'painting', name: '游艇上的午餐', nameEn: 'Luncheon of the Boating Party', image: '🍽️', year: '1881' } },
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'school-pointillism',
          name: '点彩派',
          description: '理性的光色科学',
          color: 'bg-teal-500',
          borderColor: 'border-teal-700',
          painters: [
            {
              id: 'painter-seurat',
              name: '修拉',
              nameEn: 'Georges Seurat',
              avatar: '🎨',
              desc: '点彩派创始人',
              mascotState: 'active',
              cardLevel: 2,
              schoolName: '点彩派',
              levels: [
                {
                  id: 'lvl-1',
                  name: '初级',
                  label: '色彩科学',
                  status: 'active',
                  lessons: [
                    { id: 611, type: 'lesson', name: '大碗岛', status: 'completed', stars: 3, icon: '⛱️', reward: { type: 'painting', name: '大碗岛的星期天下午', nameEn: 'A Sunday Afternoon on the Island of La Grande Jatte', image: '⛱️', year: '1884' } },
                    { id: 612, type: 'lesson', name: '阿尼埃尔浴者', status: 'active', stars: 0, icon: '🏊', reward: { type: 'painting', name: '阿尼埃尔的浴者', nameEn: 'Bathers at Asnières', image: '🏊', year: '1884' } },
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
