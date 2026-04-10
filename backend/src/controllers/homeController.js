const DiaDiem = require('../models/DiaDiem');
class homeController{
  async home(req,res){
    try{
    const diaDiemnoibat = await DiaDiem.find({hot:true});
    return res.status(200).json({
      diaDiemnoibat
    });
    }catch(err){     
      console.error('homeController.home error:', error);
      return res.status(500).json({ error: 'Internal server error' });
      }
  }
  async chitietdiadiem(req,res){
    try{
      const {slug} = req.params;
       if (!slug) {
                return res.status(400).json({ message: 'Thiếu slug' });
        }
        const diaDiems = await DiaDiem.findOne({ slug });
        if (!diaDiems) {
                return res.status(404).json({ message: 'Không tìm thấy địa điểm' });
        }
        return res.status(200).json({ diaDiems });

    }
    catch(err){
      console.error('homeController.chitietdiadiem error:', error);
      return res.status(500).json({ error: 'Internal server error' });  
  }
}
async khampha(req,res){
   try{
    const diaDiems = await DiaDiem.find();
    return res.status(200).json({
      diaDiems
    });
    }catch(err){     
      console.error('homeController.khampha error:', error);
      return res.status(500).json({ error: 'Internal server error' });
      }
}
}
module.exports = new homeController();