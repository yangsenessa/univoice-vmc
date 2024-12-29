  // A partial Interface factory
  export const tokenLedegerIdlFactory = ({ IDL }) => {
    const Tokens = IDL.Nat;
    const Subaccount = IDL.Vec(IDL.Nat8);
    const Account = IDL.Record({
      'owner' : IDL.Principal,
      'subaccount' : IDL.Opt(Subaccount),
    });
   
    return IDL.Service({
      'icrc1_balance_of' : IDL.Func([Account], [Tokens], ['query']),
    });
  };