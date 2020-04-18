/* author: MH */
/* Creation date: 3/01/2012 */

  //  Nuclear Power Plant   S I M U L A T O R   ***
  
  var slider1Pos=0;slider2Pos=0;slider3Pos=0;
  var pump1=false;pump2=false;Running=false;lightsOn=false;display=false;isPaused=false;UpDn=false;lightsOn=false;
  
  var timerNormal=false;timerFast=false;timerZero=false;timerDisplay=false;
  var timerFastInterval=300;timerZeroInterval=70;timerDisplayInterval=300;
  var timerNormalInterval=900;
  
  var day=0;hour=0;costRepair=0;costReplace=0;currentMW=0;lastMW=1;repairItem=0;
  var incomeTotal=0;incomeNet=0;income=0;repairCosts=0;
  var auxPower=0;exMaint=0;exLease=0;exPersonel=0;percent=0;exVentFine=0;emergencyVenting=0;ventingTotal=0;
  var gen=0;tur=1;twr=2;vent=3;heat=4;sec=5;core=6;pri=7;
  
  var rods=0;FuelRods=100;factorFuelRods=.99975;FuelRodLight='images/GrnLight.gif';LastFuelRodLight='images/GrnLight.gif';
  var kilowatts=0;zero=20;
  var currentHeat=0;maxHeat=535;
  var rateChangeCore=5;currentCore=0;targetCore=0;
  var rateChangePri=5;targetPri=0;currentPri=0;maxPri=335;factorPriCool=1000;
  var rateChangeSec=5;targetSec=0;currentSec=0;maxSec=335;
  var rateChangeTur=10;targetTur=0;currentTur=0;maxTur=3335;
  var rateChangeGen=10;targetGen=0;currentGen=0;maxGen=3335;
  var rateChangeTwr=5;targetTwr=0;currentTwr=0;maxTwr=335;
  var currentShaft=false;lastShaft=false;totalGameHours=0;maxScore=0;maxKilowatts=0;maxPercent=0;
         
  Slide=new Array('s0.gif','s1.gif','s2.gif','s3.gif','s4.gif','s5.gif','s6.gif','s7.gif','s9.gif','s10.gif','s11.gif','s12.gif','s13.gif','s14.gif','s15.gif','s16.gif','s17.gif','s18.gif','s19.gif','s20.gif','s21.gif','s22.gif','s23.gif','s24.gif','s25.gif','s26.gif','s27.gif','s28.gif','s29.gif','s30.gif','s31.gif','s32.gif','s33.gif','s34.gif','s35.gif','s36.gif','s37.gif','s38.gif','s39.gif','s40.gif','s41.gif','s42.gif','s43.gif','s44.gif','s45.gif','s46.gif','s47.gif','s48.gif','s49.gif','s50.gif','s51.gif');

var arrayCity = new Array(64);arrayBeacon = new Array(16); 
//var condition = new Array(100,100,100,100,100,100,100,100);

// ############################  CREATE main array 'wrc'   0-7 1st and 0-9 2nd  dimension  #############################
    var wrc = new Array(8);
    for(index=0 ; index < wrc.length; index++)
    wrc[index] = new Array(10);

//############################
  function initialize()
//############################
{
  var i=0;
  
  if(!Running)                  // If sim is Running, do nothing ###############
  {  
  if(!display)                // If random display not running, turn ON ######
    {buildCity()
    timerDisplay=setInterval("displayCity()",timerDisplayInterval);
	display=true;}
  else                        // If randon display is running, turn OFF ######
    {clearInterval(timerDisplay);
    lightsOff();
	display=false;}
  }
  for(i=0 ; i < wrc.length; i++)
    {wrc[i][0]='statusOff';
    wrc[i][1]='statusOff';
    //wrc[i][2]='OffLight';    // Not Used Yet maybe use for control rods.
	wrc[i][3]='OffLight';
	wrc[i][4]='OffLight';
	wrc[i][5]=100;}
}

//############################
  function zero1()
//############################
{ 
  document.reactorForm.indicator[0].src='images/i'+zero+'.gif';
  document.reactorForm.indicator[1].src='images/i'+zero+'.gif';
  document.reactorForm.indicator[2].src='images/i'+zero+'.gif';
  document.reactorForm.indicator[3].src='images/i'+zero+'.gif';
  document.reactorForm.indicator[4].src='images/i'+zero+'.gif';
  document.reactorForm.indicator[5].src='images/i'+zero+'.gif';
  document.reactorForm.indicator[6].src='images/i'+zero+'.gif';
  document.reactorForm.indicator[7].src='images/i'+zero+'.gif';
  document.npsForm.slider1.src='images/'+Slide[zero];
  document.npsForm.slider2.src='images/'+Slide[zero];
  document.npsForm.slider3.src='images/'+Slide[zero];
  document.npsForm.sliderMeter[0].value=zero;
  document.npsForm.sliderMeter[1].value=zero;
  document.npsForm.sliderMeter[2].value=zero;
  document.reactorForm.wrcMeter[0].value=zero; //generator meter
  document.reactorForm.wrcMeter[1].value=zero; //turbine meter
  document.reactorForm.wrcMeter[2].value=zero; //tower meter
  document.reactorForm.wrcMeter[3].value=zero; //vent meter
  //document.reactorForm.wrcMeter[4].value=zero; //heat exchanger meter
  document.reactorForm.wrcMeter[5].value=zero; //secondary coolant meter
  //document.reactorForm.wrcMeter[6].value=zero; //reactor core meter
  document.reactorForm.wrcMeter[7].value=zero; //primary coolant meter
  zero--;
  if(zero<0){clearInterval(timerZero);zero=20;}
}

//############################
  function zeroMeters()
//############################
   {timerZero=setInterval("zero1()",timerZeroInterval);}

// ###########################
    function checkStatus()
// ###########################
{
  var i=0;
  
  for(i=0 ; i < wrc.length; i++)                // test for change of STATUS in reactor Good/Warn/Fail 
    {
	if(wrc[i][0]!=wrc[i][1])
	  {
	  document.reactorForm.wrcTool[i].src='images/'+wrc[i][1]+'.gif';
	  wrc[i][0]=wrc[i][1];
	  }
    if(wrc[i][3]!=wrc[i][4])                   //test for change of STATUS lights in repair facility
      {document.repairForm.conditionLight[i].src='images/'+wrc[i][4]+'.gif';
      wrc[i][3]=wrc[i][4];}
    if(wrc[i][1]=='statusFail'){endSimulation();}
    }
} 

// ###########################
    function endSimulation()
// ###########################
{
  if(currentCore>1200)               // ### Status is MELTDOWN !! ###
  {
  testMeltDown();
  StopSimulator();
  document.messForm.mess1.value='Simulation STOPPED. You have just had a MELTDOWN !! Restart Simulator to continue.';
  }                        
  else
  {
  newMessLite();
  pauseSimulator();
  document.messForm.mess1.value='Simulation PAUSED. You have had a failure. Repair/Maintain reactor components to continue. If you do not have enough money, you can Stop/Reset and play a new game.';
  }
} 

//############################
  function StartStopSimulator()
//############################
{ 
  //if(!isPaused)
  newMessLite();
  clearInterval(timerZero);
  //zero=0; zero1();
  zero=20;  
  document.repairForm.textInfo.value='Reactor equipment can be Maintained & Repaired if damaged during a Warn or Fail condition. It will however cost you money.';
  if(Running)
        {StopSimulator();}
  else  {StartSimulator();}
}

//############################
  function StartSimulator()
//############################
{
  var i=0;
  
  zeroMeters();      //timerZero=setInterval("zero1()",timerZeroInterval);
  if(timerDisplay){clearInterval(timerDisplay);}
  lightsOff();                                              // Turn OFF City lights if ON
  document.cityForm.statusOnOff.style.color="#00A300";      //  Set ON to Green color
  document.cityForm.statusOnOff.value="ON";                 //  Set to ON 
  
  timerNormal=setInterval("programControl()",timerNormalInterval);
  document.npsForm.startLight.src="images/GrnLight.gif";   // Turn on Simulator 'ON' light
  
  slider1Pos=0;slider2Pos=0;slider3Pos=0;
  document.npsForm.slider1.src='images/s0.gif';            // Turn all Sliders down
  document.npsForm.slider2.src='images/s0.gif';
  document.npsForm.slider3.src='images/s0.gif';

  //###################################  RESET VARIABLES   ###########   RESET VARIABLES   ########  RESET VARIABLES  ###########
  //##                                                                                                                         ##                                                                                                  
  //###################################  RESET VARIABLES   ###########   RESET VARIABLES   ########  RESET VARIABLES  ###########                        
  incomeTotal=0;incomeNet=0;income=0;auxPower=0;exMaint=0;exLease=0;exPersonel=0;exVentFine=0;repairCosts=0;
  day=0;hour=0;FuelRods=100;tempSpread=5;currentCore=76;targetCore=0;currentPri=0;currentSec=0;
  currentGen=0;currentTur=0;currentVent=0;currentHeat=0;currentTwr=60;
  totalGameHours=0;maxKilowatts=0;maxScore=0;maxPercent=0;percent=0;
  
  for(i=0 ; i < wrc.length; i++)  // Set status & laststatus to OFF  Set all conditionLights to off  
    {    
	//document.reactorForm.wrcMeter[i].value=00;   // reset all reactor meters to 00
	wrc[i][0]='statusOff';
    wrc[i][1]='statusOff';
    //wrc[i][2]='not used';
	wrc[i][3]='OffLight';
	wrc[i][4]='OffLight';
	wrc[i][5]=100;
    document.repairForm.conditionPercent[i].value=wrc[i][5];     // condition of Gen thru Pri conditionPercent
    }
  document.npsForm.SecPump.style.color="#006600";                // set back to Green color
  document.npsForm.SecPump.value='Secondary Pump';               // in case was in the middle of an Auto Adjusting cycle
  document.repairForm.conditionPercent[8].value=FuelRods;        // fuel rod life
  document.moneyForm.profitPerCent.value=percent;
  document.messForm.mess1.value="Next, click the + button on the right side of the reactor core slider to raise the Control Rods and start the nuclear reaction. As the Reactor Core starts to heat up, you will need to bring up the Primary Coolant flow to prevent a meltdown.";
  resetExpenses();
  setStatusGood();
  Running=true;
}

//############################
  function StopSimulator()
//############################
{
  document.reactorForm.shaft.src='images/shaft2.gif';
  if(isPaused){document.npsForm.pauseLight.src="images/OffLight.gif";isPaused=false;}
  
  if(pump1 || pump2){pumpsOff();}
  clearInterval(timerNormal);
  document.npsForm.startLight.src="images/red_light2.gif";      // Start/Reset light back to RED
  
  document.messForm.mess1.value='Simulator is OFF. To START simulator, click the Start-Reset button. ( the flashing RED light )';
  document.cityForm.statusOnOff.style.color="#A30000";     //  Set ON to Red color
  document.cityForm.statusOnOff.value="OFF";               //  Set to OFF 
  Running=false;
}

//############################
  function pauseSimulator()
//############################
{
  if(Running)
  {
  document.messForm.mess1.value='The Simulator is now RUNNING again. Check all your readouts.';
    if(isPaused)    //  ################  then un Pause  ####################
	{
	//document.reactorForm.shaft.src='images/shaft2slow.gif';
	timerNormal=setInterval("programControl()",timerNormalInterval);
    document.cityForm.statusOnOff.style.color="#00A300";    //  Set ON to Green color
    document.cityForm.statusOnOff.value="ON";               //  Set to OFF 
	document.npsForm.pauseLight.src="images/OffLight.gif";
	isPaused=false;
    }
    else           //  ################  then Pause it. ####################
    {
	document.messForm.mess1.value='-PAUSED-  When the Simulator is paused, all activity stops. When you unpause the Simulator all activity continues from where you left off. To reset and start over, first click the Start/Reset button to stop the Simulator. You can look at all the settings to see how things went. Click the Start/Reset button again and the Simulator will reset all systems and start fresh. This is particularly convenient if you just had a MeltDown !';
	clearInterval(timerNormal);
    document.cityForm.statusOnOff.style.color="#A3A300";    //  Set PAUSE to Yellow color
	document.cityForm.statusOnOff.value="PAUSED";
	document.npsForm.pauseLight.src="images/yel_light.gif";
	isPaused=true;
    }
  }	 
}


// ###########################
    function normalSpeed()
// ###########################
   {timerNormalInterval=900;} 

// ###########################
    function fastSpeed()
// ###########################
   {timerNormalInterval=300;} 

// ###########################
    function setGameScore()
// ###########################
{
  var part1=0;part2=0;part3=0;score=0;i=0;damageTotal=0;
  part1=Math.round(kilowatts);
  if(part1>maxKilowatts){maxKilowatts=part1;}
  part2=percent;
  if(part2<0){part2=1;}
  //part3=Math.round(totalGameHours/2);
  part3=totalGameHours;
	
  score=(part1*part2)+part3;
  if(score>maxScore){maxScore=score;}
  document.cityForm.gameScore.value=maxScore;
  document.cityForm.demand.value=Math.round(2.942 * currentMW)+' %';
  
  for(i=0 ; i < wrc.length; i++)
    {
	damageTotal=damageTotal+wrc[i][5];
    //document.testForm.test9.value=damageTotal;
	}
	document.repairForm.damage.value=Math.round((damageTotal/800)*100)+' %';
} 

//############################        #################################################################################
    function programControl()       //##                         MAIN PROGRAM FUNCTION                               ##         
//############################        #################################################################################
{
  setHourDay()
  setCore()
  setPri()
  setSec()
  setHeat()
  setTur()
  setGen()
  setTwr()
  setVent()
  setIncome()
  checkStatus()
  updateGrid()
  lifeFuelRods()
  setGameScore()
}

// ###########################
    function newMessLite()
// ###########################
   {document.messForm.lightRed1.src='images/lightRed3.gif';
	document.messForm.lightRed2.src='images/lightRed3.gif';} 

// ###########################
    function doRepairs()
// ###########################
{
  document.repairForm.textInfo.value='You do not have enough money to repair that item or the condition is 90% or better.';
  if(!costRepair){document.repairForm.textInfo.value='Please select an item above to Repair.';}
  
  //#################       THIS IS FOR FUEL RODS ONLY      ########################
  if(repairItem==8 && incomeNet>costRepair && FuelRods<90)
  {
	document.repairForm.conditionLight[repairItem].src='images/GrnLight.gif';
	document.repairForm.conditionPercent[repairItem].value=100;
	document.repairForm.textInfo.value='Congratulations, you now have NEW Fuel Rods.';
	FuelRods=100;
    repairCosts=repairCosts+costRepair;
    document.moneyForm.expense[5].value=repairCosts;
  }
  else
  {
    if(wrc[repairItem][5]<90 && incomeNet>costRepair)
    {
      repairCosts=repairCosts+costRepair;
      document.moneyForm.expense[5].value=repairCosts;
      wrc[repairItem][0]='statusGood';
	  wrc[repairItem][1]='statusGood';                                   // ### Status is Good    ###
	  wrc[repairItem][3]='GrnLight';
      wrc[repairItem][4]='GrnLight';
	  wrc[repairItem][5]=100;                                            // ### condition=100%    ### 
	  document.reactorForm.wrcTool[repairItem].src='images/'+wrc[repairItem][1]+'.gif';
      document.repairForm.conditionLight[repairItem].src='images/'+wrc[repairItem][4]+'.gif';
      document.repairForm.conditionPercent[repairItem].value=wrc[repairItem][5];
	  document.repairForm.textInfo.value='Congratulations, repairs on reactor are complete.';

      if(repairItem==6)// New fuel rods included with Reactor Core #############################################
	    {document.repairForm.conditionLight[repairItem].src='images/GrnLight.gif';
        document.repairForm.conditionPercent[repairItem].value=100;
        document.repairForm.textInfo.value='Congratulations, you now have NEW Fuel Rods.';
        FuelRods=100;}
	  if(isPaused){	
	    document.messForm.mess1.value='Congratulations, repairs on reactor are complete. Unpause Simulator to continue and check all controls.';}
	  else
	  {document.messForm.mess1.value='Congratulations, repairs on reactor are complete.';}
	}
  }
} 

// ###########################
  function setIncome()
// ###########################
{
  if(kilowatts)
    {   
    income=Math.round((kilowatts*120)*100)/100;   // 120 (.12) multiplier because display is MegaWatts
    incomeTotal=incomeTotal+income;
    document.moneyForm.income1.value=Math.round(incomeTotal);
	//auxPower=0;
	}
	else
	{
      if(pump1){auxPower=auxPower+6000;}  //4000
      if(pump2){auxPower=auxPower+6000;}  //4000
	  document.moneyForm.expense[0].value=auxPower;
	}
  
  // ###############  MAKE GAME A LITTLE HARDER  #################
  exMaint=exMaint+1850;        //1250;  
  exLease=exLease+1550;        //950;
  exPersonel=exPersonel+1825;  //1050;
  
  document.moneyForm.expense[1].value=exVentFine;
  document.moneyForm.expense[2].value=exMaint;
  document.moneyForm.expense[3].value=exLease;
  document.moneyForm.expense[4].value=exPersonel;
  
  incomeNet=Math.round(incomeTotal-(auxPower+exVentFine+exMaint+exLease+exPersonel+repairCosts));
  if(incomeNet<0){document.moneyForm.balance.style.color="#FF3333";}
    else{document.moneyForm.balance.style.color="#33FF33";}
  document.moneyForm.balance.value=incomeNet;
  
  if(kilowatts || incomeTotal){percent=Math.round((incomeNet/incomeTotal)*100);}
  if(percent>0){document.moneyForm.profitPerCent.value=percent+' %';}
}

// ###########################                ####################################################
    function setTwr()                       //##           controls Cooling Tower               ##
// ###########################                ####################################################
{  var i=0;

  //#######################################   COOLING TOWER   COOLING TOWER   ################################################
  currentTwr=Math.round((.1*currentHeat)+(.2*currentSec)+(.064*currentTur));  //####### TOWER TEMPERATURE ########
  if(currentTwr<60){currentTwr=60;} 
  i=Math.round((currentTwr/maxTwr)*49);if(i<1){i=0;}if(i>49){i=49;}
  document.reactorForm.indicator[twr].src='images/i'+i+'.gif';
  document.reactorForm.wrcMeter[twr].value=currentTwr;
  if(currentTwr<250){wrc[twr][1]='statusGood';}                           // ### Status is Good    ###
  if(currentTwr>250)
  {
	wrc[twr][1]='statusWarn';                                              // ### Status is Warn    ###
	wrc[twr][5]=wrc[twr][5]-1;                                              // ### reduce condition  ###  
    document.repairForm.conditionPercent[twr].value=wrc[twr][5];            // ### update display    ###
	if(wrc[twr][5]<75){wrc[twr][4]='yel_light';}
    if(wrc[twr][5]<50){wrc[twr][4]='red_light2';wrc[twr][1]='statusFail';}  // ### Status is Fail    ### 
  }
}

// ###########################                ####################################################
    function setVent()                    //##        controls Emergency Venting             ##
// ###########################                ####################################################
{  var i=0;

//#####################################   EMERGENCY VENTING  EMERGENCY VENTING   #########################################
  if(currentHeat>405) 
    {emergencyVenting=emergencyVenting+Math.round(.22*currentHeat);
    ventingTotal=ventingTotal+emergencyVenting;
    exVentFine=15*ventingTotal;   //10*ventingTotal;  //###############  MAKE GAME A LITTLE HARDER  #################
    wrc[vent][1]='statusWarn';                                                 // ### Status is Warn    ###
    wrc[vent][5]=wrc[vent][5]-1;                                               // ### reduce condition  ###
    document.repairForm.conditionPercent[vent].value=wrc[vent][5];             // ### update display    ###
	if(wrc[vent][5]<75){wrc[vent][4]='yel_light';}
    if(wrc[vent][5]<50){wrc[vent][4]='red_light2';wrc[vent][1]='statusFail';}  // ### Status is Fail    ### 
	}
  if(currentHeat<400 && wrc[vent][1]!='statusFail')
    {emergencyVenting=0;
    wrc[vent][1]='statusGood';                                                 // ### Status is Good    ###
	}
  document.reactorForm.wrcMeter[vent].value=emergencyVenting;
  document.moneyForm.expense[1].value=exVentFine;
}

// ###########################                ####################################################
    function setGen()                       //##             controls   Generator               ##
// ###########################                ####################################################
{  var i=0;
   if(currentTur>100)
     {currentGen=currentTur+2;}            // (copy all calculations for gen from turbine) plus gen fails first 
   else
     {currentGen=currentTur;}
   
  //###########################  UPDATE GENERATOR METER AND INDICATOR   ###########################################
  i=Math.round((currentGen/maxGen)*49);if(i<1){i=0;}if(i>49){i=49;}
  document.reactorForm.indicator[gen].src='images/i'+i+'.gif';
  document.reactorForm.wrcMeter[gen].value=currentGen;

  if(currentGen<2500)
	{wrc[gen][1]='statusGood';}                                           // ### Status is Good    ###
  if(currentGen>2500)
  {
	wrc[gen][1]='statusWarn';                                               // ### Status is Warn     ###
    wrc[gen][5]=wrc[gen][5]-1;                                              // ### reduce condition   ###  
    document.repairForm.conditionPercent[gen].value=wrc[gen][5];            // ### update display     ###
    if(wrc[gen][5]<75){wrc[gen][4]='yel_light';}                            // ### update status lite ### 
    if(wrc[gen][5]<50){wrc[gen][4]='red_light2';
    wrc[gen][1]='statusFail';}                                               // ### Status is Fail     ### 
  }
}

// ###########################                ####################################################
    function setTur()                       //##            controls Steam Turbine              ##
// ###########################                ####################################################
{
  var i=0;
  if(pump2)
  {	
	if(currentHeat>220)                          //######  Set Turbine SPEED  if HOT enough to produce STEAM    ########
	{
	targetTur=Math.round((currentSec*currentHeat)/39 );                    //######   SET TARGET TURBINE SPEED  ########
    
    //rateChangeTur=(Math.round((targetTur-currentTur)/20))+1;         // How fast Turbine speed changes (20)
	
	if(currentTur<2000){rateChangeTur=29;}
	if(currentTur>2000){rateChangeTur=14;}
	if(currentTur>2300){rateChangeTur=6;}
	if(currentTur>2450){rateChangeTur=2;}
	if(currentTur<targetTur){currentTur=currentTur+rateChangeTur;}
	if(currentTur>targetTur){currentTur=currentTur-rateChangeTur;}
	}
    else // is less than 220 degrees                        Heat Exchanger is less than 220 degrees (no steam)  ########
	{
	currentTur=currentTur-19;                                 //#########   Turbine speed starts slowing down   ########
	if(currentTur>1500){currentTur=currentTur-39;}
	if(currentTur<1){currentTur=0;}
	}
  }// end of if(pump2)

  if(!pump2)       //  ##############  Pump is OFF or PUMP FAILURE  ################
  {
  currentTur=currentTur-29;                             //#########   Turbine speed starts slowing down   ########
  if(currentTur>1500){currentTur=currentTur-39;}
  if(currentTur<1){currentTur=0;}
  }//end of if(!pump2) 	
  
  //###########################  UPDATE TURBINE METER AND INDICATOR   ###########################################
  i=Math.round((currentTur/maxTur)*49);if(i<1){i=0;}if(i>49){i=49;}
  document.reactorForm.indicator[tur].src='images/i'+i+'.gif';
  document.reactorForm.wrcMeter[tur].value=currentTur;
  
  //  ##################     CHECK STATUS WARN FAIL GOOD AND CONDITION FOR TURBINE   #################################
  if(currentTur<2500)
    {wrc[tur][1]='statusGood';}                                               // ### Status is Good    ###
  if(currentTur>2500)
    {
	// ##################   TURBINE   TURBINE   TURBINE   TURBINE   TURBINE    ##########################
	wrc[tur][1]='statusWarn';                                               // ### Status is Warn     ###
	wrc[tur][5]=wrc[tur][5]-1;                                              // ### reduce condition   ###  
    document.repairForm.conditionPercent[tur].value=wrc[tur][5];            // ### update display     ###
	if(wrc[tur][5]<75){wrc[tur][4]='yel_light';}                            // ### update status lite ###
	if(wrc[tur][5]<50){wrc[tur][4]='red_light2';wrc[tur][1]='statusFail';}  // ### tur Status is Fail ###
    }  

  if(currentTur>200)                                        // ########  Generator starts producing ELECTRICITY  ########
  //{kilowatts=(Math.round(41*currentGen))/1000;    //41           // ########         calculate MEGAwatts              ########
   {kilowatts= (Math.round((41*currentGen)/100))/10;  //41           // ########         calculate MEGAwatts              ########
  currentShaft=true;
  }
  else{kilowatts=0;currentShaft=false;}
  document.cityForm.meterMegaWatts.value=kilowatts;                    //  Mega Watts               #############  
  
  if(lastShaft != currentShaft)            // #########  IF TURBINE SHAFT & KILOWATT BULBS needs to be CHANGED  #########
  {
  if(currentShaft)
    {document.reactorForm.shaft.src='images/shaft2slow.gif';lastShaft=currentShaft;
    document.cityForm.bulb1.src='images/light_mini1.gif';
	document.cityForm.bulb2.src='images/light_mini1.gif';}
  else
    {document.reactorForm.shaft.src='images/shaft2.gif';lastShaft=currentShaft;
    document.cityForm.bulb1.src='images/bulbOff.gif';
	document.cityForm.bulb2.src='images/bulbOff.gif';}
  }
  document.cityForm.meterMegaWatts.value=kilowatts;                    //  Mega Watts               #############
}

// ###########################                ####################################################
    function setSec()                       //##     controls Secondary Coolant flow            ##
// ###########################                ####################################################
{
  var i=0; 
  if(pump2)                                  //################ IF PUMP 2 IS ON CALCULATE PRIMARY COOLANT FLOW  ######################
    {
	 targetSec=Math.round(slider3Pos*(maxSec/100));
	 if(currentSec>(.65*currentHeat))                        //  Sec flow can not exceed 65% of Heat X temp      #####################
	   {currentSec=Math.round(.65*currentHeat);
	   	slider3Pos=slider3Pos-2;                             // So, reduce Sec coolant automatically and update meters.  #############
	    document.npsForm.slider3.src='images/'+Slide[slider3Pos/2];
        document.npsForm.sliderMeter[2].value=slider3Pos;
        document.messForm.mess1.value='Secondary flow cannot exceed 65% of Heat Exchanger temperature. Increase Heat Exchanger temperature or reduce Secondary Coolant flow.';
       newMessLite();
	   document.npsForm.SecPump.style.color="#A30000"; // set to RED color
	   document.npsForm.SecPump.value='Auto Adjusting';
	   document.npsForm.PumpLight2.src='images/red_light2.gif';
	   }
     else
	 {
	 if(document.npsForm.SecPump.value=='Auto Adjusting')
	   {document.npsForm.SecPump.style.color="#006600";           // set back to Green color
	   document.npsForm.SecPump.value='Secondary Pump';
	   document.npsForm.PumpLight2.src='images/GrnLight.gif';}
	 }
	 
	 i=Math.round((currentSec/maxSec)*49);if(i<1){i=0;}if(i>49){i=49;}
	 if(currentSec<targetSec)                                          // Coolant Flow is increasing
	  {
	   rateChangeSec=(Math.round((targetSec-currentSec)/40))+1;        // Rate of Coolant Flow Change
	   if(rateChangeSec>25){rateChangeSec=25;}
	   currentSec=currentSec+rateChangeSec;
	  }                                                                        
	 if(targetSec<currentSec)                                          // Coolant Flow is decreasing
	  {
	   rateChangeSec=(Math.round((currentSec-targetSec)/40))+1;        // Rate of Coolant Flow Change
	   if(rateChangeSec>25){rateChangeSec=25;}
	   currentSec=currentSec-rateChangeSec;
	  }                                                                           
	}
	else                                                              //  If Pump2 is OFF slowing reduce Coolant Flow
	{
	 rateChangeSec=3;
	 currentSec=currentSec-rateChangeSec;
	 if(currentSec<0){currentSec=0}
	 i=Math.round((currentSec/maxSec)*49);if(i<1){i=0;}if(i>49){i=49};
    }
    
  document.reactorForm.indicator[sec].src='images/i'+i+'.gif';
  document.reactorForm.wrcMeter[sec].value=currentSec;

  if(currentSec<250){wrc[sec][1]='statusGood';}                             // ### Status is Good    ###
  if(currentSec>250)
    {wrc[sec][1]='statusWarn';                                              // ### Status is Warn    ###
	wrc[sec][5]=wrc[sec][5]-1;                                              // ### reduce condition  ###  
    document.repairForm.conditionPercent[sec].value=wrc[sec][5];            // ### update display    ###
	if(wrc[sec][5]<75){wrc[sec][4]='yel_light';}
	if(wrc[sec][5]<50){wrc[sec][4]='red_light2';wrc[sec][1]='statusFail';}  // ### Status is Fail    ### 
	}
}

// ###########################                ####################################################
    function setHeat()                      //##           set & check   Heat Exchanger         ##
// ###########################                ####################################################
{  var i=0; 

  // calculate HEAT EXCHANGER HEAT EXCHANGER if any Primary Coolant Flow  ##########
  if(currentPri)
  {
  currentHeat=Math.round((.5*currentCore)+(slider2Pos*1.5))-75;  //75           
  if(currentHeat<72){currentHeat=72;}
  }
  else            // wind down Heat Exchanger temp in pri pump off but core still hot
  {
  currentHeat=currentHeat-rateChangePri;
  if(currentHeat<72){currentHeat=72;}
  }
    
  i=Math.round((currentHeat/maxHeat)*49);if(i<1){i=0;}if(i>49){i=49;}
  document.reactorForm.indicator[heat].src='images/i'+i+'.gif';
  document.reactorForm.wrcMeter[heat].value=currentHeat;
  
  if(currentHeat<400 && wrc[heat][1]!='statusFail')
    {wrc[heat][1]='statusGood';}       // test all for status change on Heat Exchanger    ####################
  if(currentHeat>400)
    {
	wrc[heat][1]='statusWarn';
	wrc[heat][5]=wrc[heat][5]-1;
    document.repairForm.conditionPercent[heat].value=wrc[heat][5];
	if(wrc[heat][5]<75){wrc[heat][4]='yel_light';}
	if(wrc[heat][5]<50){wrc[heat][4]='red_light2';wrc[heat][1]='statusFail';} 
	}
}

// ###########################                ####################################################
    function setPri()                       //##   controls Core & Heat Exchanger Temperature   ##
// ###########################                ####################################################
{
  var i=0;h=0; 
  if(pump1)                                  //################ IF PUMP IS ON CALCULATE PRIMARY COOLANT FLOW  ######################
    {
	 targetPri=Math.round(slider2Pos*(maxPri/100));
     i=Math.round((currentPri/maxPri)*49);if(i<1){i=0;}if(i>49){i=49};
	 if(currentPri<targetPri)                                          // Coolant Flow is increasing
	  {
	   rateChangePri=(Math.round((targetPri-currentPri)/40))+1;        // Rate of Coolant Flow Change
	   if(rateChangePri>25){rateChangePri=25;}
	   currentPri=currentPri+rateChangePri;
	  }                                                                        
	 if(targetPri<currentPri)                                          // Coolant Flow is decreasing
	  {
	   rateChangePri=(Math.round((currentPri-targetPri)/40))+1;        // Rate of Coolant Flow Change
	   if(rateChangePri>25){rateChangePri=25;}
	   currentPri=currentPri-rateChangePri;
	  }                                                                           
	}
	else                                                              //  If Pump1 is OFF slowing reduce Coolant Flow
	{
	 rateChangePri=3;
	 currentPri=currentPri-rateChangePri;
	 if(currentPri<0){currentPri=0}
	 i=Math.round((currentPri/maxPri)*49);if(i<1){i=0;}if(i>49){i=49};
    }
  //######################  display Primary Coolant Flow and Indicator ######################
  document.reactorForm.indicator[pri].src='images/i'+i+'.gif';
  document.reactorForm.wrcMeter[pri].value=currentPri;
    
  if(currentPri<250){wrc[pri][1]='statusGood';}                             // ### Status is Good    ###
  if(currentPri>250)
    {wrc[pri][1]='statusWarn';                                              // ### Status is Warn    ###
	wrc[pri][5]=wrc[pri][5]-1;                                              // ### reduce condition  ###  
    document.repairForm.conditionPercent[pri].value=wrc[pri][5];            // ### update display    ###
	if(wrc[pri][5]<75){wrc[pri][4]='yel_light';}
	if(wrc[pri][5]<50){wrc[pri][4]='red_light2';wrc[pri][1]='statusFail';}  // ### Status is Fail    ### 
	}
}

// ###########################
    function setCore()
// ###########################
{  var i;
  
  if(slider2Pos==0){slider2Pos=2;}                                // Pri Coolant can't be zero                    
  if(slider1Pos==0)                                               // Control rods are all the way IN (no reaction)
    {
	rateChangeCore=5;
	currentCore=currentCore-rateChangeCore;                           // Slowly bleed of Core Temperature 
    if(currentCore<76){currentCore=76;}                             // don't let Core temp go negative                           
	}
  if(slider1Pos>0 && slider2Pos>0)                                // If rods are raised AND pri cool is on then calc temp.
    {                                     
	targetCore=Math.round(slider1Pos*(factorPriCool/slider2Pos)); // Factor in Primary Coolant Loop Effect on Temperature
    targetCore=Math.round(targetCore*(FuelRods)/100);             // Reduce Temperature slightly for Life of Fuel Rods
  
	if(currentCore<targetCore)                                    // Temperature is increasing
	  {
	  rateChangeCore=(Math.round((targetCore-currentCore)/30))+1;     // How fast Core Temp changes (20)
	  if(rateChangeCore>20){rateChangeCore=20;}
	  currentCore=currentCore+rateChangeCore;
	  }                                                                        
	if(targetCore<currentCore)                                    // Temperature is decreasing
	  {
	  rateChangeCore=(Math.round((currentCore-targetCore)/30))+1;     // How fast Core Temp changes (20)
	  if(rateChangeCore>20){rateChangeCore=20;}
	  currentCore=currentCore-rateChangeCore;
	  }                                                                           
    }
  document.reactorForm.wrcMeter[core].value=currentCore;
  i=Math.round((currentCore/1000)*49);if(i<1){i=0;}if(i>49){i=49};
  document.reactorForm.indicator[core].src='images/i'+i+'.gif';
  if(currentCore<750){wrc[core][1]='statusGood';}                              // ###   Status is Good      ###
  if(currentCore>750)
    {wrc[core][1]='statusWarn';                                                // ###   Status is Warn      ###
	wrc[core][5]=wrc[core][5]-1;                                               // ###   reduce condition    ###
    document.repairForm.conditionPercent[core].value=wrc[core][5];             // ###   update display      ###
	if(wrc[core][5]<75){wrc[core][4]='yel_light';}
	if(wrc[core][5]<50){wrc[core][4]='red_light2';wrc[core][1]='statusFail';}  // ###   Status is Fail      ### 
	}
  if(currentCore>1200){wrc[core][4]='red_light2';wrc[core][1]='statusFail';}
  
	//  TESTING  TESTING  TESTING  TESTING  TESTING  TESTING  TESTING  TESTING    ####################################################
	//document.testForm.test1.value=rateChangeCore;                               //#         T E S T I N G    T E S T I N G          ##
	//document.testForm.test2.value=rateChangePri;                                //####################################################
	//document.testForm.test3.value=currentMW;                                    //#################################################### 
	//document.testForm.test4.value=targetTur;                                    //#         T E S T I N G    T E S T I N G          ##
	//document.testForm.test5.value=targetCore;                                   //####################################################
	//document.testForm.test6.value=totalGameHours;
    //document.testForm.test7.value=kilowatts;
    //document.testForm.test8.value=currentMW;
	//document.testForm.test9.value=repairItem;
	//document.testForm.test9.value=Math.round(totalGameHours/66.66);   //   ######   900   miliseconds per clock cycle. ###############
}

//############################
    function displayCity()
//############################
{
  k=parseInt(Math.random()*64);
  if(arrayCity[k]=='dark')
    {r=parseInt(Math.random()*5);  //try a number from 0 or 1	     	  
    if(r==0){document.cityForm.cityWin[k].src="images/windowLite.gif";}
    if(r==1){document.cityForm.cityWin[k].src="images/windowLite1.gif";}
    if(r==2){document.cityForm.cityWin[k].src="images/windowLite2.gif";}
    if(r==3){document.cityForm.cityWin[k].src="images/windowLite3.gif";}
    if(r==4){document.cityForm.cityWin[k].src="images/windowLite4.gif";}// two lites off
	arrayCity[k]='lite';}

  k=parseInt(Math.random()*64);
  if(arrayCity[k]=='lite')      
    {document.cityForm.cityWin[k].src="images/windowDark.gif";
    arrayCity[k]='dark';}
}



//############################
  function repairMessage(item)
//############################
{ 
  var item;
  repairItem=item-1;
  switch(item)
  {
  case 1:
    document.repairForm.textInfo.value='Maintenance and Repairs on the GENERATOR will cost $400,000';
	costRepair=400000;break;
  case 2:
    document.repairForm.textInfo.value='Maintenance and Repairs on the STEAM TURBINE will cost $500,000';
	costRepair=500000;break;
  case 3:
    document.repairForm.textInfo.value='Maintenance and Repairs on the COOLING TOWER will cost $600,000';
	costRepair=600000;break;
  case 4:
    document.repairForm.textInfo.value='Maintenance and Repairs on the EMERGENCY VENTING will cost $600,000';
	costRepair=600000;break;
  case 5:
    document.repairForm.textInfo.value='Maintenance and Repairs on the HEAT EXCHANGER will cost $750,000';
	costRepair=750000;break;
  case 6:
    document.repairForm.textInfo.value='Maintenance and Repairs on the SECONDARY COOLANT PUMP will cost $400,000';
	costRepair=400000;break;
  case 7:
    document.repairForm.textInfo.value='Maintenance and Repairs on the REACTOR CORE will run you a cool $3,000,000. New FUEL RODS are included.';
	costRepair=3000000;break;
  case 8:
    document.repairForm.textInfo.value='Maintenance and Repairs on the PRIMARY COOLANT PUMP will cost $400,000';
	costRepair=400000;break;
  case 9:
    document.repairForm.textInfo.value='Replacement Fuel Rods cost $1,000,000 but are included with a new Reactor Core';
	costRepair=1000000;break;
  }
}

//############################
  function updateGrid()
//############################
{ 
  var i=0;r=0;
   
  if(kilowatts)
  {currentMW=Math.round(kilowatts/2.85)-2;
   if(currentMW>34){currentMW=34;}
  }
  else
  {
   currentMW=0;
   i=0                                  // shut off all lights is any are on
	 while(i !=64)
	 {
      if(arrayCity[i]=='lite')
	   {
	   arrayCity[i]='dark';
	   document.cityForm.cityWin[i].src="images/windowDark.gif";
	   i=63;
	   }	  
	  i++;
	 }
  }
	
  if(lastMW != currentMW)                  // if there has been a CHANGE IN POWER  
  {
    if(lastMW<currentMW)                   // POWER IS GOING UP   Turn on another city light
	{
	  i=63                                  // start from bottom row & turn on first light 
	  while(i !=0)
	    {
          if(arrayCity[i]=='dark')
		  {
		  arrayCity[i]='lite';
		  document.cityForm.cityWin[i].src="images/windowLite1.gif";
          //r=parseInt(Math.random()*2);  //try a number from 0 or 1	     	  
		  //if(r==0){document.cityForm.cityWin[i].src="images/windowLite1.gif";}
		  //if(r==1){document.cityForm.cityWin[i].src="images/windowLite.gif";}
		  i=1;
		  }	  
	      i--;
	    }
	}
    
	if(lastMW>currentMW)                   // POWER IS GOING DOWN     Turn OFF a city light
	{
	  i=0                                  // start from bottom row & turn on first light 
	  while(i !=64)
	    {
          if(arrayCity[i]=='lite')
		  {
		  arrayCity[i]='dark';
		  document.cityForm.cityWin[i].src="images/windowDark.gif";
		  i=63;
		  }	  
	      i++;
	    }
	}
  lastMW=currentMW;
  }// END of change in power
}

//############################
  function testCityLights()
//############################
{ 
if(!Running){
  var i=0;r=0;
  if(!lightsOn)                // IF LIGHTS ARE   O F F   THEN TURN THEM   O N
  {
    while(i !=64)
    {
      if(arrayCity[i]=='dark')
	  { 
      document.cityForm.cityWin[i].src="images/windowLite1.gif";
	  
	  //r=parseInt(Math.random()*5);  //try a number from 0 or 1	     	  
	  //if(r==0){document.cityForm.cityWin[i].src="images/windowLite.gif";}
	  //if(r==1){document.cityForm.cityWin[i].src="images/windowLite1.gif";}
	  //if(r==2){document.cityForm.cityWin[i].src="images/windowLite2.gif";}
	  //if(r==3){document.cityForm.cityWin[i].src="images/windowLite3.gif";}
	  //if(r==4){document.cityForm.cityWin[i].src="images/windowLite4.gif";}
	  }
    i++;
	}
  lightsOn=true;
  }
  else                            // IF LIGHTS ARE   O N   THEN TURN THEM   O F F
  {
    while(i !=64)
    {
      if(arrayCity[i]=='dark')
	  { 
	  document.cityForm.cityWin[i].src="images/windowDark.gif";
	  }
    i++;
	}
  lightsOn=false;
  }
}
}

//############################
  function buildCity()
//############################
{ 
if(!Running){                     // if Sim is Running, do not allow buildCity()  
  clearCity()
  var i=48;var j=0;k=0;test1='';
  while(i !=64)                                                            //   CREATE BOTTOM ROW
    {document.cityForm.cityWin[i].src="images/windowDark.gif";
	arrayCity[i]='dark';
	i++;}  
  i=0;
  while(i != 10)                                                           //   CREATE 3rd ROW  (from top) Get 10 Numbers
    {k=parseInt(Math.random()*14)+33;  //try a number from 33 to 46
	   if(arrayCity[k]!='dark') 
	     {arrayCity[k]='dark';
		 //test1=test1+ " - " +String(k);
		 document.cityForm.cityWin[k].src="images/windowDark.gif";}
		 else{i--;}
	 i++;
    }
  test1='';
  i=0;
  while(i != 6)                         // CREATE 2ND ROW (from top) Get 6 Numbers 
    {
	k=parseInt(Math.random()*12)+18;  //try a number from 18 to 29  
      if(arrayCity[k]!='dark')        // OK, the number is not used yet
	  {
        if(arrayCity[k+16]=='dark')   // is there a city block below it?  (can't hang in midair)
		{
		arrayCity[k]='dark';
		//test1=test1+ " - " +String(k);
		document.cityForm.cityWin[k].src="images/windowDark.gif";   
		}	
        else{i--;}
      }
	  else{i--;}  
    i++;
	}
  test1='';
  i=0;
  while(i != 2)                         // CREATE 1st TOP ROW  Get 2 Numbers
    {
    k=parseInt(Math.random()*10)+3;     //try a number from 3 to 12
      if(arrayCity[k]!='dark')          // OK, the number is not used yet
	  {
	    if(arrayCity[k+16]=='dark')     // is there a city block below it?  (can't hang in midair)
	    {
		arrayCity[k]='dark';
	    //test1=test1+ " - " +String(k);
        document.cityForm.cityWin[k].src="images/windowDark.gif";
		document.cityForm.beacon[k].src="images/beacon.gif";    //################     BEACON !!!!!   #################
		}
		else{i--;}
      }
	  else{i--;}
	i++;	 
    }
    //document.messForm.mess1.value=test1;  
  lightsOn=false;
}
}

//############################
  function clearCity()
//############################
{
if(!Running)                   // If Sim is Running, do not allow clearCity.
  { 
  var i=0;
  while(i !=64)
    {
    document.cityForm.cityWin[i].src="images/empty.gif";  // use transparent images
	arrayCity[i]='';                                      // clear City array
	i++;
    }
  i=0;
  while(i !=16)
    {
    document.cityForm.beacon[i].src="images/empty.gif";   // erase beacons
	i++;
    }
  //display=false;
  }
}

//############################
  function setHourDay()
//############################
{
  hour=hour+1;
  if(hour==24){hour=0;day=day+1;}
  totalGameHours=hour+(day*24);
  
  document.moneyForm.dayTime.value=hour;
  document.moneyForm.dayDay.value=day;
}

//############################
  function lifeFuelRods()
//############################
{
  
  if(slider1Pos>0)             // Calculate REMAINING LIFE for Reactor Core FUEL RODS if Raised (core heats up)
  {  
	FuelRods=Math.round((FuelRods*factorFuelRods)*100)/100;    // /Do the math. FuelRods can not drop below 20 !!!!!!!!!!!
    document.repairForm.conditionPercent[8].value=FuelRods;
	if(FuelRods<75){FuelRodLight='images/yel_light.gif';}
    if(FuelRods<50){FuelRodLight='images/red_light2.gif';}
	if(LastFuelRodLight!=FuelRodLight)
	  {
	  document.repairForm.conditionLight[8].src=FuelRodLight;
	  LastFuelRodLight=FuelRodLight;
	  }   
	if(FuelRods<=20){endSimulation();}
  }
}

//############################
  function setSlider(whichSlider,UpDn)
//############################
{
 if(Running && !isPaused)
 {
  newMessLite();
  switch (whichSlider)
  {
  case 1:         //    #############   REACTOR CORE   slider 1  ###############
	document.messForm.mess1.value='The Primary Pump must be ON to raise Control Rods. Increase Primary Coolant flow enough to keep the Reactor Core temperature below 750 degrees.';
	if(pump1)
	{
	if(UpDn)
	  {
	  if(slider1Pos==100){slider1Pos=98;}
	  slider1Pos=slider1Pos+2;
	  document.npsForm.slider1.src='images/'+Slide[slider1Pos/2];
      }
	  else
	  {
	  if(slider1Pos==0){slider1Pos=2;}
	  slider1Pos=slider1Pos-2;
	  document.npsForm.slider1.src='images/'+Slide[slider1Pos/2];
	  }
	}              // END if(pump1) is ON
	document.npsForm.sliderMeter[0].value=slider1Pos;
	break;  
  case 2:         //##############   PRIMARY COOLANT PUMP  slider 2    ##################### 
    document.messForm.mess1.value='With the Primary Pump ON, increase coolant flow to keep the Reactor Core temperature below 750 degrees. Also, keep the Heat Exchanger below 400 degrees.';
	if(pump1)
	{
	if(UpDn)
	  {
	  if(slider2Pos==100){slider2Pos=98;}
	  slider2Pos=slider2Pos+2;
	  document.npsForm.slider2.src='images/'+Slide[slider2Pos/2];
      }
	  else
	  {
	  if(slider2Pos==0){slider2Pos=2;}
	  slider2Pos=slider2Pos-2;
	  document.npsForm.slider2.src='images/'+Slide[slider2Pos/2];
	  }
	}
	document.npsForm.sliderMeter[1].value=slider2Pos;
	break;
  case 3:           //##############   SECONDARY COOLANT PUMP  slider 3   ###################33
    document.messForm.mess1.value='With the Secondary Pump ON, increase coolant flow to send steam to the Steam Turbine speed. You cannot do this until the Heat Exchanger reaches 220 degrees. Keep the Heat Exchanger temperature below 400 degrees and the Steam Turbine speed below 2500 RPM.';
	if(pump2)
	{
    if(UpDn)
	  {
	  if(slider3Pos==100){slider3Pos=98;}
	  slider3Pos=slider3Pos+2;
	  document.npsForm.slider3.src='images/'+Slide[slider3Pos/2];
      }
	  else
	  {
	  if(slider3Pos==0){slider3Pos=2;}
	  slider3Pos=slider3Pos-2;
	  document.npsForm.slider3.src='images/'+Slide[slider3Pos/2];
	  }
	}  
    document.npsForm.sliderMeter[2].value=slider3Pos;
	break;    
  }
  }
}

//############################
  function pumpsOff()
//############################
{
  pump1=false;pump2=false;
  //###################  PUMP 1 OFF   ####################
  document.npsForm.PumpLight1.src="images/OffLight.gif";
  document.reactorForm.horzPipe3L.src="images/horzPipeOFF1.gif";
  document.reactorForm.horzPipe5L.src="images/horzPipeOFF1.gif";
  document.reactorForm.vertPipe4L.src="images/vertPipeOFF1.gif";
  document.reactorForm.vertPipe4M.src="images/vertPipeOFF1.gif";

  //###################  PUMP 2 OFF   ####################
  document.npsForm.PumpLight2.src="images/OffLight.gif";
  document.reactorForm.horzPipe1R.src="images/horzPipeOFF1.gif";
  document.reactorForm.horzPipe3R.src="images/horzPipeOFF1.gif";
  document.reactorForm.vertPipe2M.src="images/vertPipeOFF1.gif";
  document.reactorForm.vertPipe2R.src="images/vertPipeOFF1.gif";
}

//############################
  function setPumpON(whichPump)
//############################
{
  if(Running)
  {
  newMessLite();
  switch (whichPump)
  {
   case 1:
     if(!pump1)                        //turn ON
	 {
	 //slider2Pos=2;
	 document.npsForm.slider2.src='images/'+Slide[slider2Pos/2];
	 document.npsForm.PumpLight1.src="images/GrnLight.gif";
	 document.messForm.mess1.value="Be sure to increase Primary Coolant slider when you increase Reactor Core slider";
	 document.reactorForm.horzPipe3L.src="images/horzRtoLred.gif";
	 document.reactorForm.horzPipe5L.src="images/horzLtoRred.gif";
	 document.reactorForm.vertPipe4L.src="images/vertTtoBred.gif";
	 document.reactorForm.vertPipe4M.src="images/vertBtoTred.gif";
	 pump1=true;
	 }
     else                              //turn OFF
     {
	 document.npsForm.PumpLight1.src="images/OffLight.gif";
	 document.reactorForm.horzPipe3L.src="images/horzPipeOFF1.gif";
	 document.reactorForm.horzPipe5L.src="images/horzPipeOFF1.gif";
	 document.reactorForm.vertPipe4L.src="images/vertPipeOFF1.gif";
	 document.reactorForm.vertPipe4M.src="images/vertPipeOFF1.gif";
     slider2Pos=0;
	 document.npsForm.slider2.src='images/'+Slide[slider2Pos/2];
	 document.npsForm.sliderMeter[1].value=slider2Pos;
	 pump1=false;
	 }
	 break;
   case 2:
     document.messForm.mess1.value='Once the Heat Exchanger reaches 220 degrees, increase the Secondary Coolant flow to send steam to the Steam Turbine which will turn the Generator and produce Power.';
	 if(!pump2)                         //turn ON
	 {
	 //slider3Pos=2;
     document.npsForm.slider3.src='images/'+Slide[slider3Pos/2];
	 document.npsForm.PumpLight2.src="images/GrnLight.gif";
	 document.reactorForm.horzPipe1R.src="images/horzLtoRwht.gif";
	 document.reactorForm.horzPipe3R.src="images/horzRtoL.gif";
	 document.reactorForm.vertPipe2M.src="images/vertBtoTwht.gif";
	 document.reactorForm.vertPipe2R.src="images/vertTtoB.gif";
	 pump2=true;
	 }
     else                                //turn OFF
	 {
	 document.npsForm.PumpLight2.src="images/OffLight.gif";
     document.reactorForm.horzPipe1R.src="images/horzPipeOFF1.gif";
	 document.reactorForm.horzPipe3R.src="images/horzPipeOFF1.gif";
	 document.reactorForm.vertPipe2M.src="images/vertPipeOFF1.gif";
	 document.reactorForm.vertPipe2R.src="images/vertPipeOFF1.gif";
	 slider3Pos=0;
	 document.npsForm.slider3.src='images/'+Slide[slider3Pos/3];
     document.npsForm.sliderMeter[2].value=slider3Pos;
	 pump2=false;
	 }
	 break;
  }
  }  	 
}

//############################
  function resetExpenses()
//############################
{
  var i=0;
  while(i !=6){document.moneyForm.expense[i].value=0;i++;}
  document.moneyForm.income1.value=0;
  document.moneyForm.balance.value=0;
}

//############################
  function testWarn()
//############################
{
  var i=0;
  while(i !=9)
  {
  if(i<8){document.reactorForm.wrcTool[i].src="images/statusWarn.gif";}
  document.repairForm.conditionLight[i].src="images/yel_light.gif";
  i++;}
} 

//############################
  function testFail()
//############################
{
  var i=0;
  while(i !=9)
  {
  if(i<8){document.reactorForm.wrcTool[i].src="images/statusFail.gif";}
  document.repairForm.conditionLight[i].src="images/red_light2.gif";
  i++;}
} 

//############################
  function testMeltDown()
//############################
{
  testFail();
  var i=0;
  while(i !=8){document.reactorForm.wrcTool[i].src="images/statusMeltDown.gif";i++;}
} 

//############################
  function lightsOff()
//############################
{
  var i=0;
  while(i !=64)
  {
    if(arrayCity[i]=='dark' || arrayCity[i]=='lite')
    {document.cityForm.cityWin[i].src="images/windowDark.gif";
	arrayCity[i]='dark';}
    i++;
  }
}

//############################
  function QuickStart()
//############################
{ 
  if(Running)
   {}
  else
  {
  StartStopSimulator();setPumpON(1);setPumpON(2);
  slider1Pos=54;slider2Pos=74;slider3Pos=74;
  Running=true;
  }
}

// ###########################
    function setStatusOff()
// ###########################
{
  var i=0;
  for(i=0 ; i < wrc.length; i++)
    {
	wrc[i][0]='statusOff';
    wrc[i][1]='statusOff';
    //wrc[i][2]  NOT USED YET
	wrc[i][3]='OffLight';
	wrc[i][4]='OffLight';
	document.reactorForm.wrcTool[i].src='images/statusOff.gif';
	document.repairForm.conditionLight[i].src='images/'+wrc[i][4]+'.gif';
	}
  document.repairForm.conditionLight[8].src='images/OffLight.gif';    // fuel rod light
}

// ###########################
    function setStatusGood()
// ###########################
{
  var i=0;
  for(i=0 ; i < wrc.length; i++)
    {
	wrc[i][0]='statusGood';
    wrc[i][1]='statusGood';
    //wrc[i][2]  NOT USED YET    
	wrc[i][3]='GrnLight';
    wrc[i][4]='GrnLight';
    wrc[i][5]=100;
    document.reactorForm.wrcTool[i].src='images/statusGood.gif';
	document.repairForm.conditionLight[i].src='images/'+wrc[i][4]+'.gif';
	}
  document.repairForm.conditionLight[8].src='images/GrnLight.gif';    // fuel rod light
}
