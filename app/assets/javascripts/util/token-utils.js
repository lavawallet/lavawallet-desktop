




module.exports = class TokenUtils{


 

  static getRawFromDecimalFormat(amountFormatted,decimals)
  {
    if(isNaN(amountFormatted)) {return amountFormatted;}

    var amountRaw = amountFormatted * Math.pow(10,decimals)

    amountRaw = Math.floor(amountRaw)

    return amountRaw;
  }

  static formatAmountWithDecimals(amountRaw,decimals)
  {

    if(isNaN(amountRaw)) return amountRaw;

    var amountFormatted = amountRaw / (Math.pow(10,decimals) * 1.0)

  //  amountFormatted = Math.round(amountFormatted,decimals)

    return amountFormatted;
  }



  }
