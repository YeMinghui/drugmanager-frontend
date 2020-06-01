var ypid = ""
/*
ypid 代码结构

x    xxxx       xxx     xx   xx
|     |         |       |     |
|     |         |       |     --->同品规下各厂家与各包装组合的流水码 changjiabaozhuang
|     |         |       ---->同品种下各品规流水码 guige
|     |         --->同药理/功效下各品种流水码 pinzhong
|     ---> 药理/功效分类编码 gongxiao
---->药品大类 dalei

 */

const fenlei = [
  {
    name: '化学药品', value: '1',
    sub: [
      {
        name: '抗生素类药物', value: '01',
        sub: [
          {name: '青霉素类', value: '01'},
          {name: '头孢菌素类', value: '02'},
          {name: '碳青霉烯类', value: '03'},
          {name: 'β-内酰胺酶抑制剂及其与β-内酰胺类抗生素配伍的复方制剂', value: '04'},
          {name: '氨基糖苷类', value: '05'},
          {name: '酰胺醇类', value: '06'},
          {name: '四环素类', value: '07'},
          {name: '大环内酯类', value: '08'},
          {name: '林可酰胺类', value: '09'},
          {name: '多肽类', value: '10'},
          {name: '糖肽类', value: '11'},
          {name: '噁唑酮', value: '12'},
          {name: '三硫代烯丙醚类', value: '13'},
          {name: '其他抗生素类抗感染药', value: '99'},
        ]
      },
      {
        name: '化学合成的抗菌药', value: '02',
        sub: [
          {name: '磺胺类及其增效剂', value: '01'},
          {name: '喹诺酮类', value: '02'},
          {name: '硝基呋喃类', value: '03'},
          {name: '硝基咪唑类', value: '04'},
          {name: '其他化学合成的抗菌药', value: '99'},
        ]
      },
      {
        name: '抗分枝杆菌药物', value: '03',
        sub: [
          {name: '抗结核药', value: '01'},
          {name: '抗麻风药', value: '02'},
          {name: '其他抗分枝杆菌药', value: '99'},
        ]
      },
      {
        name: '抗真菌药物', value: '04',
        sub: [
          {name: '吡咯类', value: '01'},
          {name: '嘧啶类', value: '02'},
          {name: '多烯类', value: '03'},
          {name: '棘白菌素类', value: '04'},
          {name: '咪唑类', value: '05'},
          {name: '烯丙胺类', value: '06'},
          {name: '其他抗真菌药', value: '99'},
        ]
      },
      {
        name: '抗病毒药物', value: '05',
        sub: [
          {name: '广谱抗病毒药', value: '01'},
          {name: '抗人类免疫缺陷病毒药', value: '02'},
          {name: '抗疱疹病毒药', value: '03'},
          {name: '抗巨细胞病毒药', value: '04'},
          {name: '抗流感及呼吸道病毒药', value: '05'},
          {name: '抗肝炎病毒药', value: '06'},
          {name: '核苷类逆转录酶抑制剂', value: '07'},
          {name: '蛋白酶抑制剂', value: '08'},
          {name: '环戊烷类', value: '09'},
          {name: '其他抗病毒药', value: '99'},
        ]
      },
      {
        name: '抗寄生虫药物', value: '06',
        sub: [
          {name: '抗血吸虫病药', value: '01'},
          {name: '抗疟药', value: '02'},
          {name: '驱肠虫药', value: '03'},
          {name: '抗丝虫药', value: '04'},
          {name: '抗阿米巴及抗滴虫药', value: '05'},
          {name: '抗利什曼原虫药', value: '06'},
          {name: '其他抗寄生虫药', value: '99'},
        ]
      },
      {
        name: '其他抗感染类药物', value: '09',
        sub: [
          {name: '消毒防腐药', value: '01'},
          {name: '其他抗感染类药', value: '99'},
        ]
      },
      {
        name: '维生素类、矿物质类及营养类药物', value: '11',
        sub: [
          {name: '维生素A、D属', value: '01'},
          {name: '维生素B属', value: '02'},
          {name: '维生素C及其他', value: '03'},
          {name: '复合维生素制剂', value: '04'},
          {name: '微量元素与矿物质', value: '05'},
          {name: '肠内营养药', value: '06'},
          {name: '肠外营养药', value: '07'},
          {name: '其他维生素类、矿物质类及营养类药', value: '99'},
        ]
      },
      {
        name: '糖类、盐类与酸碱平衡调节药物', value: '12',
        sub: [
          {name: '葡萄糖及其他', value: '01'},
          {name: '电解质平衡调节药', value: '02'},
          {name: '酸碱平衡调节药', value: '03'},
          {name: '其他糖、盐及酸碱平衡调节药', value: '99'},
        ]
      },
      {
        name: '酶类及其他生化药物', value: '13',
        sub: [
          {name: '酶及辅酶类药', value: '01'},
          {name: '核酸类药', value: '02'},
          {name: '其他生化药', value: '99'},
        ]
      },
      {
        name: '激素及调节内分泌功能类药物', value: '14',
        sub: [
          {name: '垂体激素及下丘脑释放激素药', value: '01'},
          {name: '促性激素类药', value: '02'},
          {name: '促肾上腺皮质激素类药及抑制药', value: '03'},
          {name: '肾上腺皮质激素类药', value: '04'},
          {name: '胰岛素及其类似物', value: '05'},
          {name: '口服降糖药', value: '06'},
          {name: '其他降糖药', value: '07'},
          {name: '甲状腺激素及抗甲状腺类药', value: '08'},
          {name: '钙代谢调节药物及抗骨质疏松药', value: '09'},
          {name: '雄激素、抗雄激素及同化激素类药', value: '10'},
          {name: '雌激素类及抗雌激素药', value: '11'},
          {name: '孕激素类与抗孕激素类药', value: '12'},
          {name: '前列腺素类药', value: '13'},
          {name: '其他激素及调节内分泌功能药', value: '99'},
        ]
      },
      {
        name: '调节免疫功能药物', value: '15',
        sub: [
          {name: '免疫抑制剂', value: '01'},
          {name: '免疫增强剂', value: '02'},
          {name: '其他调节免疫功能药', value: '99'},
        ]
      },
      {
        name: '抗变态反应药物', value: '16',
        sub: [
          {name: '抗组胺药', value: '01'},
          {name: '过敏反应介质阻释剂', value: '02'},
          {name: '其他抗变态反应药', value: '99'},
        ]
      },
      {
        name: '抗肿瘤药物', value: '18',
        sub: [
          {name: '烷化剂', value: '01'},
          {name: '抗代谢药', value: '02'},
          {name: '抗肿瘤抗生素', value: '03'},
          {name: '植物来源的抗肿瘤药及其衍生物', value: '04'},
          {name: '激素类抗肿瘤药', value: '05'},
          {name: '抗肿瘤辅助用药', value: '06'},
          {name: '生物靶向抗肿瘤药', value: '07'},
          {name: '芳香化酶抑制剂', value: '08'},
          {name: '酪氨酸激酶抑制剂', value: '09'},
          {name: '其他抗肿瘤药', value: '99'},
        ]
      },
      {
        name: '神经系统用药物', value: '21',
        sub: [
          {name: '中枢神经兴奋药', value: '01'},
          {name: '镇静、催眠药', value: '02'},
          {name: '抗精神病药', value: '03'},
          {name: '抗抑郁抗躁狂药', value: '04'},
          {name: '抗焦虑药', value: '05'},
          {name: '抗癫痫及抗惊厥药', value: '06'},
          {name: '抗帕金森病药', value: '07'},
          {name: '抗重症肌无力药', value: '08'},
          {name: '抗脑血管病药', value: '09'},
          {name: '抗痴呆药和脑代谢调节药', value: '10'},
          {name: '镇痛药', value: '11'},
          {name: '解热镇痛抗炎药', value: '12'},
          {name: '抗偏头痛药', value: '13'},
          {name: '抗痛风药', value: '14'},
          {name: '其他神经系统用药', value: '99'},
        ]
      },
      {
        name: '麻醉及其辅助用药物', value: '23',
        sub: [
          {name: '全身麻醉药', value: '01'},
          {name: '局部麻醉药', value: '02'},
          {name: '麻醉辅助药', value: '03'},
          {name: '其他麻醉用药', value: '99'},
        ]
      },
      {
        name: '呼吸系统用药物', value: '24',
        sub: [
          {name: '祛痰药', value: '01'},
          {name: '镇咳药', value: '02'},
          {name: '平喘药', value: '03'},
          {name: '感冒用药', value: '04'},
          {name: '其他呼吸系统用药', value: '99'},
        ]
      },
      {
        name: '心血管系统用药物', value: '25',
        sub: [
          {name: '强心药', value: '01'},
          {name: '抗心律失常药', value: '02'},
          {name: '防治心绞痛药', value: '03'},
          {name: '抗高血压药', value: '04'},
          {name: '抗休克药', value: '05'},
          {name: '周围血管扩张药', value: '06'},
          {name: '调节血脂药及抗动脉粥样硬化药', value: '07'},
          {name: '其他循环系统用药', value: '99'},
        ]
      },
      {
        name: '消化系统用药物', value: '26',
        sub: [
          {name: '治疗消化性溃疡药与胃食管反流病药', value: '01'},
          {name: '助消化药', value: '02'},
          {name: '胃肠解痉药', value: '03'},
          {name: '促胃肠动力药与止吐、催吐药', value: '04'},
          {name: '泻药、止泻药', value: '05'},
          {name: '食欲抑制剂及其他减肥药', value: '06'},
          {name: '治疗肝性脑病药与肝病辅助药', value: '07'},
          {name: '利胆药与胆石溶解药', value: '08'},
          {name: '治疗炎性肠病药', value: '09'},
          {name: '微生态制剂', value: '10'},
          {name: '肛肠科用药', value: '11'},
          {name: '其他消化系统用药', value: '99'},
        ]
      },
      {
        name: '泌尿系统用药物', value: '27',
        sub: [
          {name: '利尿药', value: '01'},
          {name: '脱水药', value: '02'},
          {name: '尿崩症用药', value: '03'},
          {name: '透析用药', value: '04'},
          {name: '前列腺疾病用药物及勃起功能障碍治疗药物', value: '05'},
          {name: '其他泌尿系统用药', value: '99'},
        ]
      },
      {
        name: '血液系统用药物', value: '28',
        sub: [
          {name: '抗贫血药', value: '01'},
          {name: '促凝血药', value: '02'},
          {name: '抗凝血药', value: '03'},
          {name: '血浆及血容量扩充剂', value: '04'},
          {name: '促白细胞增生药', value: '05'},
          {name: '促血小板增生药', value: '06'},
          {name: '抗血小板聚集药', value: '07'},
          {name: '其他血液系统用药', value: '99'},
        ]
      },
      {
        name: '专科用药物', value: '29',
        sub: [
          {name: '外科用药', value: '01'},
          {name: '皮肤科用药', value: '02'},
          {name: '眼科用药', value: '03'},
          {name: '耳鼻喉科用药', value: '04'},
          {name: '口腔科用药', value: '05'},
          {name: '妇产科用药', value: '06'},
          {name: '其他专科用药', value: '99'},
        ]
      },
      {
        name: '计划生育用药', value: '30',
        sub: [
          {name: '避孕药', value: '01'},
          {name: '其他计划生育用药', value: '99'},
        ]
      },
      {
        name: '解毒药', value: '71',
        sub: [
          {name: '氰化物中毒解毒药', value: '01'},
          {name: '有机磷酸酯类中毒解毒药', value: '02'},
          {name: '亚硝酸盐中毒解毒药', value: '03'},
          {name: '阿片类中毒解毒药', value: '04'},
          {name: '鼠药解毒药', value: '05'},
          {name: '金属中毒解毒药', value: '06'},
          {name: '其他解毒药', value: '99'},
        ]
      },
      {
        name: '诊断用药物', value: '72',
        sub: [
          {name: '造影剂', value: '01'},
          {name: '器官功能检查剂', value: '02'},
          {name: '其他诊断用药', value: '99'},
        ]
      },
      {
        name: '特殊管理药物', value: '80',
        sub: [
          {name: '麻醉药品', value: '01'},
          {name: '第一类精神药品', value: '02'},
          {name: '第二类精神药品', value: '03'},
          {name: '医疗用毒性药品', value: '04'},
          {name: '放射性药品', value: '05'},
          {name: '其他特管药品', value: '99'},
        ]
      },
      {
        name: '制剂辅料', value: '90',
        sub: [
          {name: '制剂稳定性辅料', value: '01'},
          {name: '固体制剂辅料', value: '02'},
          {name: '半固体制剂辅料', value: '03'},
          {name: '液体制剂辅料', value: '04'},
          {name: '其他制剂辅料', value: '99'},
        ]
      },
      {
        name: '其他化学药物', value: '99',
        sub: [
          {name: '三防特殊用药', value: '01'},
          {name: '卫生防疫用药', value: '02'},
          {name: '其他化学药', value: '99'},
        ]
      },
    ]
  },
  {
    name: '生物制品', value: '2',
    sub: [
      {
        name: '预防用生物制品', value: '01',
        sub: [
          {name: '疫苗类生物制品', value: '01'},
          {name: '抗毒素及免疫血清类生物制品', value: '02'},
          {name: '血液制品类生物制品', value: '03'},
          {name: '细胞因子类生物制品', value: '04'},
          {name: '生长因子类生物制品', value: '05'},
          {name: '酶类生物制品', value: '06'},
          {name: '其他预防用生物制品', value: '99'},
        ]
      },
      {
        name: '诊断用生物制品', value: '02',
        sub: [
          {name: '体内诊断用生物制品', value: '01'},
          {name: '细菌类体外诊断用生物制品', value: '02'},
          {name: '病毒类体外诊断用生物制品', value: '03'},
          {name: '立克次体类体外诊断用生物制品', value: '04'},
          {name: '血液、免疫类体外诊断用生物制品', value: '05'},
          {name: '其他类体外诊断用生物制品', value: '06'},
          {name: '其他诊断用生物制品', value: '99'},
        ]
      },
      {
        name: '治疗用生物制品', value: '03',
        sub: [
          {name: '抗毒素及免疫血清类生物制品', value: '01'},
          {name: '血液制品类生物制品', value: '02'},
          {name: '细胞因子类生物制品', value: '03'},
          {name: '生长因子类生物制品', value: '04'},
          {name: '酶类生物制品', value: '05'},
          {name: '其他治疗用生物制品', value: '99'},
        ]
      },
      {
        name: '其它生物制品', value: '99',
        sub: [
          {name: '其他生物制品', value: '99'},
        ]
      },
    ]
  },
  {
    name: '中成药', value: '3',
    sub: [
      {
        name: '解表剂', value: '01',
        sub: [
          {name: '辛温解表', value: '01'},
          {name: '辛凉解表', value: '02'},
          {name: '扶正解表', value: '03'},
          {name: '其他解表剂', value: '99'},
        ]
      },
      {
        name: '泻下剂', value: '02',
        sub: [
          {name: '寒下', value: '01'},
          {name: '温下', value: '02'},
          {name: '润下', value: '03'},
          {name: '攻补兼施', value: '04'},
          {name: '逐水', value: '05'},
          {name: '其他泻下剂', value: '99'},
        ]
      },
      {
        name: '和解剂', value: '03',
        sub: [
          {name: '和解少阳', value: '01'},
          {name: '调和肝脾', value: '02'},
          {name: '调和胃肠', value: '03'},
          {name: '表里双解', value: '04'},
          {name: '其他和解剂', value: '99'},
        ]
      },
      {
        name: '清热剂', value: '04',
        sub: [
          {name: '清热泻火', value: '01'},
          {name: '清热凉血', value: '02'},
          {name: '清热解毒', value: '03'},
          {name: '清热生津', value: '04'},
          {name: '清脏腑热', value: '05'},
          {name: '祛暑剂', value: '06'},
          {name: '清散虚热', value: '07'},
          {name: '其他清热剂', value: '99'},
        ]
      },
      {
        name: '温里剂', value: '05',
        sub: [
          {name: '温中祛寒', value: '01'},
          {name: '回阳救逆', value: '02'},
          {name: '温经散寒', value: '03'},
          {name: '其他温里药', value: '99'},
        ]
      },
      {
        name: '补益剂', value: '06',
        sub: [
          {name: '补气', value: '01'},
          {name: '补血', value: '02'},
          {name: '气血双补', value: '03'},
          {name: '补阴', value: '04'},
          {name: '补阳', value: '05'},
          {name: '阴阳双补', value: '06'},
          {name: '补肝肾,强筋骨', value: '07'},
          {name: '其他补益剂', value: '99'},
        ]
      },
      {
        name: '固涩剂', value: '07',
        sub: [
          {name: '固表止汗', value: '01'},
          {name: '涩肠固脱', value: '02'},
          {name: '固肾止遗', value: '03'},
          {name: '其他固涩剂', value: '99'},
        ]
      },
      {
        name: '安神剂', value: '08',
        sub: [
          {name: '补养安神', value: '01'},
          {name: '重镇安神', value: '02'},
          {name: '其他安神药（含解表,清热祛风除痰镇惊；清热安神）', value: '99'},
        ]
      },
      {
        name: '开窍剂', value: '09',
        sub: [
          {name: '凉开', value: '01'},
          {name: '温开', value: '02'},
          {name: '其他开窍剂', value: '99'},
        ]
      },
      {
        name: '理气剂', value: '10',
        sub: [
          {name: '理气行滞', value: '01'},
          {name: '理气宽胸', value: '02'},
          {name: '理气舒肝', value: '03'},
          {name: '理气调中', value: '04'},
          {name: '其他理气剂', value: '99'},
        ]
      },
      {
        name: '理血剂', value: '11',
        sub: [
          {name: '活血', value: '01'},
          {name: '止血', value: '02'},
          {name: '活血养血', value: '03'},
          {name: '其他理血剂', value: '99'},
        ]
      },
      {
        name: '疏风剂', value: '12',
        sub: [
          {name: '疏散外风', value: '01'},
          {name: '平熄内风', value: '02'},
          {name: '其他疏风剂', value: '99'},
        ]
      },
      {
        name: '治燥剂', value: '13',
        sub: [
          {name: '清宣润燥', value: '01'},
          {name: '滋阴润燥', value: '02'},
          {name: '其他治燥剂', value: '99'},
        ]
      },
      {
        name: '祛湿剂', value: '14',
        sub: [
          {name: '化湿和胃', value: '01'},
          {name: '清热祛湿', value: '02'},
          {name: '利水渗湿化浊', value: '03'},
          {name: '温化水湿', value: '04'},
          {name: '祛湿化浊', value: '05'},
          {name: '祛风除湿', value: '06'},
          {name: '其他祛湿药', value: '99'},
        ]
      },
      {
        name: '祛痰剂', value: '15',
        sub: [
          {name: '祛痰止咳', value: '01'},
          {name: '清热化痰', value: '02'},
          {name: '润燥化痰', value: '03'},
          {name: '温化寒(燥湿化)痰', value: '04'},
          {name: '化痰散结', value: '05'},
          {name: '补益止咳平喘', value: '06'},
          {name: '其他祛痰剂', value: '99'},
        ]
      },
      {
        name: '消食剂', value: '16',
        sub: [
          {name: '解表消食', value: '01'},
          {name: '补益止泻（痢）', value: '02'},
          {name: '解痉止胃痛', value: '03'},
          {name: '其他消食剂', value: '99'},
        ]
      },
      {
        name: '妇科用药', value: '21',
        sub: [
          {name: '补益调经(止带)', value: '01'},
          {name: '补益安胎', value: '02'},
          {name: '治产后病', value: '03'},
          {name: '其他妇科用药', value: '99'},
        ]
      },
      {
        name: '五官用药', value: '22',
        sub: [
          {name: '咽喉病', value: '01'},
          {name: '口腔、牙病', value: '02'},
          {name: '眼病', value: '03'},
          {name: '鼻病', value: '04'},
          {name: '耳病', value: '05'},
          {name: '其他五官用药', value: '99'},
        ]
      },
      {
        name: '驱虫剂', value: '23',
        sub: [
          {name: '健脾驱(杀)虫', value: '01'},
          {name: '清热燥湿(杀虫)止痒', value: '02'},
          {name: '祛风除湿（杀虫）止痒', value: '03'},
          {name: '其他驱虫剂', value: '99'},
        ]
      },
      {
        name: '涌吐药', value: '24',
        sub: [
          {name: '涌吐药', value: '01'},
          {name: '其他涌吐药', value: '99'},
        ]
      },
      {
        name: '外用药', value: '27',
        sub: [
          {name: '凉血止血治疡', value: '01'},
          {name: '治痔疮剂', value: '02'},
          {name: '烧烫冻伤', value: '03'},
          {name: '其他外用药', value: '99'},
        ]
      },
      {
        name: '民族药', value: '60',
        sub: [
          {name: '藏药', value: '01'},
          {name: '蒙药', value: '02'},
          {name: '苗药', value: '03'},
          {name: '维药', value: '04'},
          {name: '傣药', value: '05'},
          {name: '壮药', value: '06'},
          {name: '其他民族药', value: '99'},
        ]
      },
      {
        name: '其他功用', value: '99',
        sub: [
          {name: '其他功用', value: '99'},
        ]
      },
    ]
  },
  {
    name: '其他', value: '9',
    sub: [
      {
        name: '其他', value: '99',
        sub: [
          {name: '其他', value: '99'}
        ]
      }
    ]
  },
]

const dalei = [
  {name: '化学药品', value: '1'},
  {name: '生物制品', value: '2'},
  {name: '中成药', value: '3'},
  {name: '其他', value: '9'},
]

export function validationYPID(ypid) {
  if (ypid.length !== 12) return false
  if (! ['1','2','3'].includes(ypid.charAt(0))) return false
  if (ypid.substring(1,5).match(/[0]{4}/) || ! ypid.substring(1,5).match(/\d{4}/)) return false
  if (ypid.substring(5,8).match(/[0]{3}/) || ! ypid.substring(5,8).match(/[0-9A-Z]{3}/)) return false
  if (ypid.substring(8,10).match(/[0]{2}/) || ! ypid.substring(8,10).match(/[0-9A-Z]{2}/)) return false
  if (ypid.substring(10).match(/[0]{2}/) || ! ypid.substring(10).match(/[0-9A-Z]{2}/)) return false
  return true
}

export function getFenlei() {
  return fenlei
}
